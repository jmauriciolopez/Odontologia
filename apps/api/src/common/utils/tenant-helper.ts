import { SelectQueryBuilder, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { ClsService } from 'nestjs-cls';

export class TenantHelper {
  static applyFilter<T extends ObjectLiteral>(qb: SelectQueryBuilder<T>, cls: ClsService, alias?: string): SelectQueryBuilder<T> {
    const clinicaId = cls.get('clinicaId');
    const entityAlias = alias || qb.alias;
    if (clinicaId) {
      qb.andWhere(`${entityAlias}.clinicaId = :clinicaId`, { clinicaId });
    }
    return qb;
  }

  static withTenant<T extends ObjectLiteral>(cls: ClsService, options: FindManyOptions<T> = {}): FindManyOptions<T> {
    const clinicaId = cls.get('clinicaId');
    if (!clinicaId) return options;

    const where = options.where;
    let tenantWhere: any;

    if (!where) {
      tenantWhere = { clinicaId };
    } else if (Array.isArray(where)) {
      tenantWhere = where.map((w) => ({ ...w, clinicaId }));
    } else {
      tenantWhere = { ...where, clinicaId };
    }

    return { ...options, where: tenantWhere };
  }

  static withTenantOne<T extends ObjectLiteral>(cls: ClsService, options: FindOneOptions<T> = {}): FindOneOptions<T> {
    const clinicaId = cls.get('clinicaId');
    if (!clinicaId) return options;

    const where = options.where;
    let tenantWhere: any;

    if (!where) {
      tenantWhere = { clinicaId };
    } else if (Array.isArray(where)) {
      tenantWhere = where.map((w) => ({ ...w, clinicaId }));
    } else {
      tenantWhere = { ...where, clinicaId };
    }

    return { ...options, where: tenantWhere };
  }
}
