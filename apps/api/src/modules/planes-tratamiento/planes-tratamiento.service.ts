import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanTratamiento } from './entities/plan-tratamiento.entity';
import { PlanTratamientoItem } from './entities/plan-tratamiento-item.entity';
import { CreatePlanTratamientoDto } from './dto/plan-tratamiento.dto';

@Injectable()
export class PlanesTratamientoService {
  constructor(
    @InjectRepository(PlanTratamiento)
    private readonly planRepository: Repository<PlanTratamiento>,
    @InjectRepository(PlanTratamientoItem)
    private readonly itemRepository: Repository<PlanTratamientoItem>,
  ) {}

  async create(dto: CreatePlanTratamientoDto): Promise<PlanTratamiento> {
    const { items, ...planData } = dto;
    const plan = this.planRepository.create(planData);
    const savedPlan = await this.planRepository.save(plan);

    if (items && items.length > 0) {
      const planItems = items.map(item => this.itemRepository.create({
        ...item,
        planId: savedPlan.id
      }));
      await this.itemRepository.save(planItems);
    }

    return await this.findOne(savedPlan.id);
  }

  async findByPaciente(pacienteId: string): Promise<PlanTratamiento[]> {
    return await this.planRepository.find({
      where: { pacienteId },
      relations: ['items', 'profesional', 'profesional.usuario'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<PlanTratamiento> {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ['items', 'profesional', 'profesional.usuario'],
    });

    if (!plan) {
      throw new NotFoundException(`Plan de tratamiento ${id} no encontrado`);
    }

    return plan;
  }

  async updateEstado(id: string, estado: string): Promise<PlanTratamiento> {
    const plan = await this.findOne(id);
    plan.estado = estado;
    return await this.planRepository.save(plan);
  }
}
