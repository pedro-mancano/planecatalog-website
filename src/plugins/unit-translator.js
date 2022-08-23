/**
 * @param {string} unit
 */
export default (unit) => {
    unit = unit.toLowerCase().trim();
    switch (unit) {
        case 'm':
        case 'meter':
        case 'meters':
            return 'm';
        case 'm2':
        case 'square meter':
        case 'square meters':
            return 'm2';
        case 'm/s':
        case 'meter/second':
        case 'meters/second':
            return 'm/s';
        case 'm/s2':
        case 'meter/second^2':
        case 'meters/second^2':
            return 'm/s2';
        case 'm/s3':
        case 'meter/second^3':
        case 'meters/second^3':
            return 'm/s3';
        case 's':
        case 'second':
        case 'seconds':
            return 's';
        case 'hp':
        case 'horsepower':
            return 'hp';
        case 'kg':
        case 'kilogram':
        case 'kilograms':
            return 'kg';
    }
} 