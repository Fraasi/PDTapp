// original from https://gist.github.com/L-A/3497902
// original zodiac function from https://gist.github.com/kladov/5080233

/* eslint func-names: ["error", "as-needed"] */
/* eslint radix: 0 */
/* eslint no-param-reassign: 0 */
/* eslint no-array-constructor: 0 */
/* eslint no-use-before-define: 0 */
/* eslint one-var: 0 */
/* eslint no-mixed-spaces-and-tabs: 0 */
/* eslint camelcase: 0 */
/* eslint no-mixed-operators: 0 */
/* eslint no-shadow: 0 */
// Wow! learning lot of eslint and good practices


export default function MoonInfo(day, month, year) {
	const n0 = parseInt('0');
	const f0 = parseFloat('0.0');
	let AG = f0; // Moon's age
	let DI = f0; // Moon's distance in earth radii
	let LA = f0; // Moon's ecliptic latitude
	let LO = f0; // Moon's ecliptic longitude
	let Phase = ' ';

	// Related to month length and age calculations
	const n28 = parseInt('28');
	const n30 = parseInt('30');
	const n31 = parseInt('31');
	const dim = new Array(n31, n28, n31, n30, n31, n30, n31, n31, n30, n31, n30, n31);

	day = parseInt(day, 10);
	month = parseInt(month, 10);
	year = parseInt(year, 10);

	moon_posit(year, month, day);

	// 1 Earth’s equatorial radius = 6378.16 kilometers
	const toKm = 6378.16;
	this.distance = round2(DI * toKm);
	this.age = round2(AG);
	this.latitude = round2(LA);
	this.longitude = round2(LO);
	this.phase = Phase;
	this.zodiac = getZodiacSign(day, month);

	function isdayofmonth(y, m, d) {
		if (m !== 2) {
			if (d >= 1 && d <= dim[m - 1]) {
				return true;
			}
			return false;
		}

		let feb = dim[1];
		if (isleapyear(y)) feb += 1;		// is leap year
		if (d >= 1 && d <= feb) return true;
		return false;
	}

	if (!isdayofmonth(year, month, day)) {
		throw new Error(`Invalid date passed to Mooninfo! Year: ${year}, Month: ${month}, Day: ${day}`);
	}

	function isleapyear(y) {
		const x = Math.floor(y - 4 * Math.floor(y / 4));
		const w = Math.floor(y - 100 * Math.floor(y / 100));
		const z = Math.floor(y - 400 * Math.floor(y / 400));

		if (x === 0) { // possible leap year
			if (w === 0 && z !== 0) {
				return false; // not leap year
			}
			return true; // is leap year
		}

		return false;
	}

	// compute moon position and phase
	function moon_posit(Y, M, D) {
		let YY = n0,
			MM = n0,
			K1 = n0,
			K2 = n0,
			K3 = n0,
			JD = n0,
			IP = f0,
			DP = f0,
			NP = f0,
			RP = f0;

		// calculate the Julian date at 12h UT
		YY = Y - Math.floor((12 - M) / 10);
		MM = M + 9;
		if (MM >= 12) MM -= 12;

		K1 = Math.floor(365.25 * (YY + 4712));
		K2 = Math.floor(30.6 * MM + 0.5);
		K3 = Math.floor(Math.floor((YY / 100) + 49) * 0.75) - 38;

		JD = K1 + K2 + D + 59; // for dates in Julian calendar
		if (JD > 2299160) JD -= K3; // for Gregorian calendar

		// calculate moon's age in days
		IP = normalize((JD - 2451550.1) / 29.530588853);
		AG = IP * 29.53;

		// how accurate are these numbers?
		if (AG < 1.84566) Phase = 'A new moon';
		else if (AG < 5.53699) Phase = 'Waxing crescent';		// 0.1% to 49.9% Illuminated
		else if (AG < 9.22831) Phase = 'First quarter';		//  50% illuminated
		else if (AG < 12.91963) Phase = 'Waxing gibbous';		// >50% illuminated
		else if (AG < 16.61096) Phase = 'A full moon';			// 100% illuminated
		else if (AG < 20.30228) Phase = 'Waning gibbous';		// <100% illuminated
		else if (AG < 23.99361) Phase = 'Third quarter';		//  50% illuminated
		else if (AG < 27.68493) Phase = 'Waning crescent';		// 49.9% to 0.1% illuminated
		else Phase = 'A new moon';

		IP = IP * 2 * Math.PI; // Convert phase to radians

		// calculate moon's distance
		DP = 2 * Math.PI * normalize((JD - 2451562.2) / 27.55454988);
		DI = 60.4 - 3.3 * Math.cos(DP) - 0.6 * Math.cos(2 * IP - DP) - 0.5 * Math.cos(2 * IP);

		// calculate moon's ecliptic latitude
		NP = 2 * Math.PI * normalize((JD - 2451565.2) / 27.212220817);
		LA = 5.1 * Math.sin(NP);

		// calculate moon's ecliptic longitude
		RP = normalize((JD - 2451555.8) / 27.321582241);
		LO = 360 * RP + 6.3 * Math.sin(DP) + 1.3 * Math.sin(2 * IP - DP) + 0.7 * Math.sin(2 * IP);

		// correcting if longitude is not greater than 360!
		if (LO > 360) LO -= 360;
	}

	// round to 2 decimal places
	function round2(x) {
		return (Math.round(100 * x) / 100.0);
	}

	// normalize values to range 0...1
	function normalize(v) {
		v -= Math.floor(v);
		if (v < 0) v += 1;
		return v;
	}

	// calculate illumination percentage
	function illuminationPercentage(moonAge) {
		// from new to full approximately 14 days, so:
		// 100 / 14 = 7.14, more accurate than const waning = 100 / ( fullMonth - fullMoon )	// 7,7401...
		const mult = 100 / 14;
		const fullMoon = 16.61096;
		const fullMonth = 29.530588853;

		if (moonAge > fullMoon) return (fullMonth - moonAge) * mult;
		return moonAge * mult;
	}
	this.illumination = illuminationPercentage(AG).toFixed(1);

	function getZodiacSign(day, month) {
		if ((month === 1 && day <= 20) || (month === 12 && day >= 22)) {
			return 'capricorn';
		} else if ((month === 1 && day >= 21) || (month === 2 && day <= 18)) {
			return 'aquarius';
		} else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
			return 'pisces';
		} else if ((month === 3 && day >= 21) || (month === 4 && day <= 20)) {
			return 'aries';
		} else if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) {
			return 'taurus';
		} else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
			return 'gemini';
		} else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
			return 'cancer';
		} else if ((month === 7 && day >= 23) || (month === 8 && day <= 23)) {
			return 'leo';
		} else if ((month === 8 && day >= 24) || (month === 9 && day <= 23)) {
			return 'virgo';
		} else if ((month === 9 && day >= 24) || (month === 10 && day <= 23)) {
			return 'libra';
		} else if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) {
			return 'scorpio';
		} else if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) {
			return 'sagittarius';
		}
	}
}
