import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function formatDate(date: string): string {
  const str = format(new Date(date), 'II MMM yyyy', {
    locale: ptBR,
  });
  return str;
}
