import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: '*', // En producción usar la variable de entorno
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token. Disconnecting.`);
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      const clinicaId = payload.clinicaId;

      if (!clinicaId) {
        this.logger.warn(`Client ${client.id} token has no clinicaId. Disconnecting.`);
        client.disconnect();
        return;
      }

      // Unir al cliente a la sala de su clínica
      const roomName = `clinica_${clinicaId}`;
      client.join(roomName);
      this.logger.log(`Client ${client.id} connected and joined room ${roomName}`);
    } catch (error) {
      this.logger.error(`Connection error for client ${client.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  /**
   * Envía una notificación a todos los usuarios de una clínica específica
   */
  sendToClinica(clinicaId: string, event: string, data: any) {
    this.server.to(`clinica_${clinicaId}`).emit(event, data);
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    return { event: 'pong', data };
  }
}
