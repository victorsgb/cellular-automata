// Core dependencies
import formatDistance from 'date-fns/formatDistance';
import { pt } from 'date-fns/locale';
import { useRouter } from 'next/router';


interface DateProps {
  baseDate: Date;
}

export default function DateDistance({ baseDate }: DateProps) {

  const oldDate = new Date(baseDate)

  const { locale } = useRouter();

  if (locale == 'pt-BR') {

    return <p>{formatDistance(new Date(), oldDate, {locale: pt})}</p>

  } else {
    return <p>{formatDistance(new Date(), oldDate)}</p>
  }
}