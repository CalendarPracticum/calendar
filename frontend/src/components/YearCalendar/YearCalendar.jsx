import { useContext } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './YearCalendar.module.css';
import { culture, months, info, noop } from '../../utils/constants';
import { LocalizationContext } from '../../context';

export function YearCalendar() {
	const localizer = useContext(LocalizationContext);
	const { format } = localizer;

	// задаем формат шапки месяца
	const { defaultDate, formats } = {
		defaultDate: new Date(),
		formats: {
			weekdayFormat: (date) => format(date, 'eeeeee', culture),
		},
	};

	return (
		<div className={styles.year} id="year-calendar">
			<h1>Производственный календарь на {info.year} год</h1>
			<ul className={`${styles.months} ${styles.ulReset}`}>
				{months.map((month, index) => (
					<li className={styles.month} key={month}>
						<p>{month}</p>
						<Calendar
							culture={culture}
							toolbar={false}
							onDrillDown={noop}
							onNavigate={noop}
							style={{ height: 365, margin: 0, padding: 0, width: 365 }}
							className={styles.year}
							formats={formats}
							localizer={localizer}
							date={defaultDate.setFullYear(info.year, index, 1)}
							dayPropGetter={(date) => {
								const dayOfWeek = date.getDay();
								const dateOfMonth = date.getMonth();
								const nowMonth = new Date().getMonth();
								const nowDay = new Date().getDate();
								const dayOfMonth = date.getDate();

								if (dateOfMonth !== index) {
									return { className: styles.otherMonth };
								}
								if (nowDay === dayOfMonth && dateOfMonth === nowMonth) {
									return { className: styles.today };
								}

								return dayOfWeek === 0 || dayOfWeek === 6
									? { className: styles.holiday }
									: {};
							}}
						/>
					</li>
				))}
			</ul>
			<div className={styles.about}>
				<p>
					* Предпраздничные дни, в которые продолжительность работы сокращается
					на один час.
				</p>
				<h2>Комментарии к производственному календарю</h2>
				<div className={styles.commentsBlock}>
					<p>
						Норма рабочего времени на определенные календарные периоды
						исчисляется по расчетному графику пятидневной рабочей недели с двумя
						выходными днями в субботу и воскресенье исходя из продолжительности
						ежедневной работы: при 40-часовой рабочей неделе - 8 часов; при
						39-часовой рабочей неделе - 7,8 часов (39 : 5); при 36-часовой
						рабочей неделе - 7,2 часа (36 : 5); при 24-часовой рабочей неделе -
						4,8 часа (24 : 5) (смотрите п. 1 Порядка исчисления нормы рабочего
						времени на определенные календарные периоды времени (месяц, квартал,
						год) в зависимости от установленной продолжительности рабочего
						времени в неделю, утв. приказом Минздравсоцразвития России от 13
						августа 2009 г. N 588н, далее - Порядок). При этом необходимо
						помнить о запрещении работы в нерабочие праздничные дни (часть
						первая ст. 113 ТК РФ), об уменьшении на 1 час работы в
						предпраздничный день, то есть в день, непосредственно предшествующий
						нерабочему праздничному дню (часть первая ст. 95 ТК РФ), о переносе
						выходного дня при совпадении его с нерабочим праздничным днем (часть
						вторая ст. 112 ТК РФ).
					</p>
					<p>
						В соответствии с частью первой ст. 112 ТК РФ ТК РФ нерабочими
						праздничными днями в Российской Федерации являются:
					</p>
					<ul>
						<li>1, 2, 3, 4, 5, 6 и 8 января - Новогодние каникулы;</li>
						<li>7 января - Рождество Христово;</li>
						<li>23 февраля - День защитника Отечества;</li>
						<li>8 марта - Международный женский день;</li>
						<li>1 мая - Праздник Весны и Труда;</li>
						<li>9 мая - День Победы;</li>
						<li>12 июня - День России;</li>
						<li>4 ноября - День народного единства.</li>
					</ul>

					<p>
						Согласно части второй ст. 112 ТК РФ при совпадении выходного и
						нерабочего праздничного дней выходной день переносится на следующий
						после праздничного рабочий день, за исключением выходных дней,
						совпадающих с нерабочими праздничными днями с 1 по 8 января.
					</p>
					<p>{info.changing}</p>
					<p>{info.transferDays}</p>
					<p>
						Постановлением Правительства РФ от {info.decreeDate} №{' '}
						{info.decreeNumber} &ldquo;О переносе выходных дней в {info.year}{' '}
						году&rdquo; предусмотрен перенос выходных дней:
					</p>
					<ul>
						{info.listOfChanges.map((e) => (
							<li key={e}>{e}</li>
						))}
					</ul>

					<p>{info.aboutAllHoliday}</p>
					<p>{info.aboutPreHolidays}</p>
					<h3>
						Количество рабочих, выходных и нерабочих праздничных дней в{' '}
						{info.year} году по месяцам:
					</h3>
					<ul className={`${styles.statistic} ${styles.ulReset}`}>
						{info.numberOfDays.map((e) => (
							<ul key={e.name}>
								{e.name}
								<li key={e.workDays}>{e.workDays}</li>
								<li key={e.weekends}>{e.weekends}</li>
								{e.holidays ? <li key={e.holidays}>{e.holidays}</li> : ''}
							</ul>
						))}
					</ul>
					<p>
						Норма рабочего времени конкретного месяца рассчитывается следующим
						образом: продолжительность рабочей недели (40, 39, 36, 30, 24 и т.д.
						часов) делится на 5, умножается на количество рабочих дней по
						календарю пятидневной рабочей недели конкретного месяца и из
						полученного количества вычитается количество часов в данном месяце,
						на которое производится сокращение рабочего времени накануне
						нерабочих праздничных дней. В аналогичном порядке исчисляется норма
						рабочего времени в целом за год: продолжительность рабочей недели
						(40, 39, 36, 30, 24 и т.д. часов) делится на 5, умножается на
						количество рабочих дней по календарю пятидневной рабочей недели в
						году и из полученного количества вычитается количество часов в
						данном году, на которое производится сокращение рабочего времени
						накануне нерабочих праздничных дней (п. 1 Порядка). Например, в
						январе {info.year} г. при пятидневной рабочей неделе с двумя
						выходными днями будет {info.numberOfDays[0].workDays},{' '}
						{info.numberOfDays[0].weekends} и {info.numberOfDays[0].holidays}.
						Норма рабочего времени в этом месяце составит:
					</p>
					<ul>
						<li>
							при 40-часовой рабочей неделе - {info.normHoursJanuary.fortyHours}{' '}
							ч. (8 ч. x {info.numberOfDays[0].workDays});
						</li>
						<li>
							при 39-часовой рабочей неделе -{' '}
							{info.normHoursJanuary.thirtyNineHours} ч. (7,8 ч. x{' '}
							{info.numberOfDays[0].workDays});
						</li>
						<li>
							при 36-часовой рабочей неделе -{' '}
							{info.normHoursJanuary.thirtySixHours} ч. (7,2 ч. x{' '}
							{info.numberOfDays[0].workDays});
						</li>
						<li>
							при 24-часовой рабочей неделе -{' '}
							{info.normHoursJanuary.twentyFourHours} ч. (4,8 ч. x{' '}
							{info.numberOfDays[0].workDays}).
						</li>
					</ul>

					<p>
						В {info.year} г. при пятидневной рабочей неделе с двумя выходными
						днями будет {info.numberWorkDaysYear} рабочих дней, в том числе{' '}
						{info.numberPreHolidaysYear} сокращенных на один час предпраздничных
						рабочих дня, указанных выше, и {info.numberWeekendAndHolidayYear}{' '}
						выходных и нерабочих праздничных дней.
					</p>
					<p>Норма рабочего времени в {info.year} г. составит:</p>
					<ul>
						<li>
							при 40-часовой рабочей неделе - {info.normHoursYear.fortyHours} ч.
							(8 ч. x {info.numberWorkDaysYear} дней -{' '}
							{info.numberPreHolidaysYear} ч.);
						</li>
						<li>
							при 39-часовой рабочей неделе -{' '}
							{info.normHoursYear.thirtyNineHours} ч. (7,8 ч. x{' '}
							{info.numberWorkDaysYear} дней - {info.numberPreHolidaysYear} ч.);
						</li>
						<li>
							при 36-часовой рабочей неделе -{' '}
							{info.normHoursYear.thirtySixHours} ч. (7,2 ч. x{' '}
							{info.numberWorkDaysYear} дней - {info.numberPreHolidaysYear} ч.);
						</li>
						<li>
							при 24-часовой рабочей неделе -{' '}
							{info.normHoursYear.twentyFourHours} ч. (4,8 ч. x{' '}
							{info.numberWorkDaysYear} дней - {info.numberPreHolidaysYear} ч.).
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
