export type ProjectInvitation = {
  invitationId: number
  recipientId: number
  recipientName: string
  recipientEmail: string
  recipientAvatar: string
  acceptedAt: Date
  declinedAt: Date
}

export type UserInvitation = {
  invitationId: number
  senderId: number
  senderName: string
  senderEmail: string
  senderAvatar: string
  projectId: number
  projectName: string
  projectImage: string
  acceptedAt: Date
  declinedAt: Date
}
