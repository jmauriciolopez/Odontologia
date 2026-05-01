import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { BaseEntity } from '../entities/base.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
@EventSubscriber()
export class TenantSubscriber implements EntitySubscriberInterface<BaseEntity> {
  constructor(private readonly cls: ClsService) {}

  listenTo() {
    return BaseEntity;
  }

  beforeInsert(event: InsertEvent<BaseEntity>) {
    const clinicaId = this.cls.get('clinicaId');
    if (clinicaId && !event.entity.clinicaId) {
      event.entity.clinicaId = clinicaId;
    }
  }
}
