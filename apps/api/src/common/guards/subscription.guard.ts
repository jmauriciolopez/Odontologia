import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { ClinicasService } from '../../modules/clinicas/clinicas.service';
import { PacientesService } from '../../modules/pacientes/pacientes.service';
import { PlanClinica } from '../../modules/clinicas/entities/clinica.entity';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly cls: ClsService,
    private readonly clinicasService: ClinicasService,
    private readonly pacientesService: PacientesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // 1. Exenciones: Solo bloqueamos métodos de escritura que no sean Auth o similares
    const method = request.method;
    const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    
    if (!isWriteOperation) return true;

    // 2. Obtener clinicaId del contexto (inyectado por JwtStrategy/Interceptor)
    const clinicaId = this.cls.get('clinicaId');
    if (!clinicaId) return true; // Si no hay clinicaId, probablemente es un endpoint público

    // 3. Obtener datos de la clínica
    const clinica = await this.clinicasService.findById(clinicaId);
    if (!clinica || !clinica.isActive) {
      throw new ForbiddenException('La clínica no está activa o no existe.');
    }

    // Si el plan no es TRIAL, asumimos que es de pago y tiene otros límites (o ninguno por ahora)
    if (clinica.plan !== PlanClinica.TRIAL) return true;

    // 4. Validar Fecha de Expiración
    const now = new Date();
    if (now > new Date(clinica.trialExpiresAt)) {
      throw new ForbiddenException(
        'El periodo de prueba ha expirado. Por favor, actualice su plan para continuar realizando cambios.'
      );
    }

    // 5. Validar Límite de Pacientes (solo si es creación de paciente)
    const url = request.url;
    if (method === 'POST' && url.includes('/pacientes')) {
      const patientCount = await this.pacientesService.countAll();
      if (patientCount >= clinica.maxPatients) {
        throw new ForbiddenException(
          `Ha alcanzado el límite máximo de ${clinica.maxPatients} pacientes para el plan actual.`
        );
      }
    }

    return true;
  }
}
