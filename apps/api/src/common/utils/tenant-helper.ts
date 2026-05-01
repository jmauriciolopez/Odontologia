import { SelectQueryBuilder, FindManyOptions, FindOneOptions } from 'typeorm';
import { ClsService } from 'nestjs-cls';

export class TenantHelper {
  static applyFilter<T>(qb: SelectQueryBuilder<T>, cls: ClsService, alias?: string): SelectQueryBuilder<T> {
    const clinicaId = cls.get('clinicaId');
    const entityAlias = alias || qb.alias;
    if (clinicaId) {
      qb.andWhere(`${entityAlias}.clinicaId = :clinicaId`, { clinicaId });
    }
    return qb;
  }

  static withTenant<T>(cls: ClsService, options: FindManyOptions<T> = {}): FindManyOptions<T> {
    const clinicaId = cls.get('clinicaId');
    if (!clinicaId) return options;

    const newOptions = { ...options };
    if (!newOptions.where) {
      newOptions.where = { clinicaId } as any;
    } else if (Array.isArray(newOptions.where)) {
      newOptions.where = newOptions.where.map((w) => ({ ...w, clinicaId }));
    } else {
      newOptions.where = { ...newOptions.where, clinicaId } as any;
    }
    return newOptions;
  }

  static withTenantOne<T>(cls: ClsService, options: FindOneOptions<T> = {}): FindOneOptions<T> {
    const clinicaId = cls.get('clinicaId');
    if (!clinicaId) return options;

    const newOptions = { ...options };
    if (!newOptions.where) {
      newOptions.where = { clinicaId } as any;
    } else if (Array.isArray(newOptions.where)) {
      newOptions.where = newOptions.where.map((w) => ({ ...w, clinicaId }));
    } else {
      newOptions.where = { ...newOptions.where, clinicaId } as any;
    }
    return newOptions;
  }
}
