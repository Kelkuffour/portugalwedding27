interface WhatsAppRsvp {
  name: string;
  contact: string;
  attending: 'joyfully_accepts' | 'regretfully_declines';
  guestsCount: number;
  message: string;
}

export function createRsvpWhatsAppUrl(details: WhatsAppRsvp): string {
  const attending = details.attending === 'joyfully_accepts';
  const text = [
    'RSVP — Casamento de Agostinho e Kety',
    '24 de julho de 2027, às 14 horas',
    '',
    `Nome: ${details.name.trim()}`,
    `Contacto: ${details.contact.trim()}`,
    `Presença: ${attending ? 'Sim, com alegria!' : 'Não poderei estar presente.'}`,
    `Total de pessoas (incluindo o convidado): ${attending ? details.guestsCount : 0}`,
    ...(details.message.trim() ? ['', `Mensagem: ${details.message.trim()}`] : []),
  ].join('\n');
  return `https://wa.me/352661939655?text=${encodeURIComponent(text)}`;
}
