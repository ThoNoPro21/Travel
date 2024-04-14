import dayjs from 'dayjs';

import { CompareType, NonEmptyArray } from '../constants/types';
import { DATE_FORMAT } from '../constants/constants';

import { getCodeFromMessageObject } from './common.utils';

export const commonErrMsg = {
    required: 'required',
    emailInvalid: 'emailInvalid',
    emailTaken: 'emailTaken',
    imageUpload: 'imageUpload',
    passwordWrongFormat: 'passwordWrongFormat',
    passwordNotMatch: 'passwordNotMatch',
    newPasswordMatchOldPassword: 'newPasswordMatchOldPassword',
    confirmPassword: 'confirmPassword',
    passwordContainUsername: 'passwordContainUsername',
    usernameWrongFormat: 'usernameWrongFormat',
    minLength: 'minLength',
    maxLength: 'maxLength',
    maxLength200: 'maxLength200',
    maxLength65535: 'maxLength65535',
    systemError: 'systemError',
    numberRequired: 'numberRequired',
    numberPositiveRequired: 'numberPositiveRequired',
    maxNumberLength: 'maxNumberLength',
    waitUploadCompleted: 'waitUploadCompleted',
    longlatRequired: 'longlatRequired',
    numberOutOfRange: 'numberOutOfRange',
    numberOutOfRangeDuration: 'numberOutOfRangeDuration',
    decimalRequired: 'decimalRequired',
    numOfRequired: 'numOfRequired',
    percentNumberRequired: 'percentNumberRequired',
    phoneWrongFormat: 'phoneWrongFormat',
    taxCodeWrongFormat: 'taxCodeWrongFormat',
    dateTimeInvalid: 'dateTimeInvalid',
    urlWrongFormat: 'urlWrongFormat',
    arbitrationFeeFormat: 'arbitrationFeeFormat',
    arbitrationFeeToFormat: 'arbitrationFeeToFormat',
    matchWordWithoutNumber: 'matchWordWithoutNumber',
    identityCardFormat: 'identityCardFormat',
    dropdownRequired: 'dropdownRequired',
    uploadFileRequired: 'uploadFileRequired',
    yearFormat: 'yearFormat',
    yearMustbeLessThan: 'yearMustbeLessThan',
    yearStandard: 'yearStandard',
    greaterThanCurrentDate: 'greaterThanCurrentDate',
};

// RegEx
const emailRegex = /^[a-zA-Z0-9][\w\-.+_%!#$%&'*+-/=?^_`{}~|]*@[A-Za-z0-9*]+\.[A-Za-z]+\.*[A-Za-z]{2,}$/i;
const userNameRegex = /^[a-zA-Z\d]{6,}$/i;
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const passwordStrengthTest1Regex = /(?=.*?[A-Z])(?=.*?[a-z])/;
const passwordStrengthTest2Regex = /(?=.*?[0-9]).+/;
const passwordStrengthTest3Regex = /(?=.*?[#?!@$%^&*-]).+/;
const passwordStrengthTest4Regex = /(?=.*?)[\s\S]{8,}/;
const passwordStrengthTests = [passwordStrengthTest1Regex, passwordStrengthTest2Regex, passwordStrengthTest3Regex];
const imageFormatRegex = /(.*?)\.(png|jpg|jpeg|gif)$/i;
const phoneNumberRegex =
    /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){10,12})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i;

const numberRegex = /^[0-9\-]+$/;
const numberStartW0Regex = /^(?:0|00)\d+$/;
const noRequireNumberRegex = /^[0-9]+$/;
const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;
const decimalNumberRegex = /^(\d+(\.\d+)?)*$/;
const percentNumberRegex = /^(\d+(\.\d{1,2})?)$/;
const matchWordTextOnlyRegex = /^[a-zA-Z\s]+$/;
const matchNumberOnlyRegex = /^[0-9\s]+$/;
const identityCardRegex = /^[0-9]{8,16}$/;

function commonValidate(value: any, rightCondition: any, errCode: string): string {
    const validateValue = typeof value === 'string' ? value.trim() : value;
    if (
        (typeof validateValue === 'number' && isNaN(validateValue)) ||
        (typeof validateValue !== 'number' && typeof validateValue !== 'boolean' && !validateValue)
    ) {
        return commonErrMsg.required;
    }
    if (!rightCondition) {
        return errCode;
    }
    return '';
}

export function validateRequired(value: any, errCode: string = commonErrMsg.required): string {
    const condition: boolean = !Array.isArray(value) || (Array.isArray(value) && value.length > 0);
    return commonValidate(value, condition, errCode);
}

export function validateRequiredWithCondition(
    value: any,
    conditionRequired: boolean,
    errCode: string = commonErrMsg.required
): string {
    if (!conditionRequired) return '';
    const condition: boolean =
        conditionRequired && (!Array.isArray(value) || (Array.isArray(value) && value.length > 0));
    return commonValidate(value, condition, errCode);
}

export function validateDropdown(value: any): string {
    const condition: boolean = !Array.isArray(value) && value;
    return !condition ? commonErrMsg.dropdownRequired : '';
}

export const validateRequiredNullable = (value: any, errCode: string = commonErrMsg.required): string => {
    const condition: boolean = !Array.isArray(value) || (Array.isArray(value) && value.length > 0);
    if (value === undefined) {
        return commonErrMsg.required;
    }
    if (!condition) {
        return errCode;
    }
    return '';
};

export function validateMinLength(value: string, minLength: number): string {
    const condition: boolean = value.length >= minLength;
    return commonValidate(value, condition, commonErrMsg.minLength);
}

export function validateMaxLength(value: string, maxLength: number): string {
    const condition: boolean = value.length <= maxLength;
    return commonValidate(value, condition, commonErrMsg.maxLength);
}

export function validateMaxLength200(value: string, maxLength: number): string {
    if (value) {
        const condition: boolean = value.length <= maxLength;
        return commonValidate(value, condition, commonErrMsg.maxLength200);
    }
    return '';
}

export function validateMaxLength65535(value: string, maxLength: number): string {
    const condition: boolean = value.length <= maxLength;
    if (!condition) {
        return commonErrMsg.maxLength65535;
    }
    return '';
}

export function validateEmail(value?: string, notRequired = false): string {
    const validateValue = typeof value === 'string' ? value.trim() : value;
    if (notRequired && !validateValue) return '';
    const condition: boolean = emailRegex.test(value || '');
    return commonValidate(value, condition, commonErrMsg.emailInvalid);
}

export function validateUsername(value: string): string {
    const condition: boolean = userNameRegex.test(value);
    return commonValidate(value, condition, commonErrMsg.usernameWrongFormat);
}

export function validateValueDispute(value: number): string {
    const condition: boolean = value !== null && !numberStartW0Regex.test(value.toString());
    return commonValidate(value, condition, commonErrMsg.arbitrationFeeFormat);
}

export function validateValueDisputeTo(value: number, compareValue: number): string {
    const condition: boolean = value !== null && !numberStartW0Regex.test(value.toString()) && value > compareValue;
    return commonValidate(value, condition, commonErrMsg.arbitrationFeeToFormat);
}

export function validatePasswordFormat(value?: string): string {
    const condition: boolean = !!value && passwordRegex.test(value);
    return commonValidate(value, condition, commonErrMsg.passwordWrongFormat);
}

export function validatePassword(value: string, values: { username: string }): string {
    // validate required & format
    let error = validatePasswordFormat(value);
    if (!error) {
        // username & password must be not same
        const { username } = values;
        if (username && value?.includes(username)) {
            error = commonErrMsg.passwordContainUsername;
        }
    }
    return error;
}

export function validateTextOnlyFormat(value?: string): string {
    const condition: boolean = !!value && matchWordTextOnlyRegex.test(value);
    return commonValidate(value, condition, commonErrMsg.matchWordWithoutNumber);
}

export function validatePasswordStrength(value?: string): number {
    const strength = 1;
    if (!value || !passwordStrengthTest4Regex.test(value)) {
        return strength;
    }
    const tests = passwordStrengthTests.map((x) => x.test(value));

    const passedNumber = tests.filter((x) => !!x).length;
    return passedNumber;
}

export function validatePasswordConfirmationNotMatch(confirmPass?: string, newPass?: string): string {
    if (!confirmPass || !newPass) {
        return '';
    }
    const condition = newPass && confirmPass === newPass;
    return commonValidate(newPass, condition, commonErrMsg.passwordNotMatch);
}

export function validateNewPasswordMatchOldPassword(confirmPass?: string, oldPass?: string): string {
    const condition = !!confirmPass && confirmPass !== oldPass;
    return commonValidate(confirmPass, condition, commonErrMsg.newPasswordMatchOldPassword);
}

// ex: validExtensionsRegex = /^(\.jpg|\.png|\.JPG|\.PNG|\.jpeg|\.JPEG|\.mp4|\.MP4|\.flv|\.FLV|\.mkv|\.MKV)$/i
export function validateFileFormat(fileName: string, validExtensionsRegex: RegExp): boolean {
    return validExtensionsRegex.test(fileName);
}

// ex: maxSize(MB)
export function validateFileSize(fileSize: number, maxSize: number): boolean {
    return maxSize * 1048576 >= fileSize;
}

export function validateImageUpload(file: File, maxMBSize = 2, extsReg = imageFormatRegex): string {
    const condition: boolean = validateFileFormat(file.name, extsReg) && validateFileSize(file.size, maxMBSize);
    return commonValidate(file.name, condition, commonErrMsg.imageUpload);
}

export function validatePhoneNumber(value?: string): string {
    if ((value && value?.length > 12) || (value && value?.length < 10)) {
        return commonValidate(value, false, commonErrMsg.phoneWrongFormat);
    }
    const condition: boolean = phoneNumberRegex.test(value || '');
    return commonValidate(value, condition, commonErrMsg.numberRequired);
}

export function validatePhoneNumberRequired(value: string): string {
    const condition: boolean = phoneNumberRegex.test(value);
    if (!condition) {
        return commonErrMsg.phoneWrongFormat;
    }
    return '';
}

export function validatePhoneNumberNotRequired(value: string): string {
    if ((value && value?.length > 12) || (value && value?.length < 10)) {
        return commonValidate(value, false, commonErrMsg.phoneWrongFormat);
    }

    const condition: boolean = phoneNumberRegex.test(value || '');
    if (value && !condition) {
        return commonErrMsg.phoneWrongFormat;
    }
    return '';
}

export function validateUrl(value: string, errCode: string = commonErrMsg.urlWrongFormat): string {
    if (!value) return '';
    const condition: boolean = urlRegex.test(value);
    if (!condition) return errCode;
    return '';
}

export function validateCompareDateTime(
    value: string,
    comparedDate: string,
    compareType: CompareType,
    dateFormat: string = DATE_FORMAT.dateTime
): string {
    let condition = true;
    const compareValue = value && value !== 'Invalid date' ? value : null;
    if (compareValue && comparedDate) {
        if (compareType === CompareType.lessThan) {
            condition = dayjs(value, dateFormat).valueOf() < dayjs(comparedDate, dateFormat).valueOf();
        } else {
            condition = dayjs(value, dateFormat).valueOf() > dayjs(comparedDate, dateFormat).valueOf();
        }
    }
    return commonValidate(compareValue, condition, commonErrMsg.dateTimeInvalid);
}

export function validateCompareCurrentTime(value: number, comparedDate: number, compareType: CompareType): string {
    let condition = true;
    const compareValue = value || null;
    if (compareValue && comparedDate) {
        if (compareType === CompareType.lessThan) {
            condition = value > comparedDate;
        } else {
            condition = value < comparedDate;
        }
    }
    if (condition) {
        return commonErrMsg.greaterThanCurrentDate;
    }
    return '';
}

export function validateCompareDueDateRequired(
    value: string,
    comparedDate: string,
    compareType: CompareType,
    dateFormat: string = DATE_FORMAT.dateTime
): string {
    let condition = true;
    const compareValue = value && value !== 'Invalid date' ? value : null;
    if (compareValue === 'Invalid Date') return commonErrMsg.required;
    if (compareValue && comparedDate) {
        if (compareType === CompareType.lessThan) {
            condition = dayjs(value).isBefore(comparedDate);
        } else {
            const currentDate = dayjs(new Date()).unix() * 1000;
            condition = dayjs(value).isAfter(comparedDate) && dayjs(value).isAfter(currentDate.toString());
        }
    }
    return commonValidate(compareValue, condition, commonErrMsg.dateTimeInvalid);
}

export function validateNumber(value: any, isPositive = false, includeZero = false): string {
    if (value === undefined || value === null) return '';
    const isNumber: boolean = numberRegex.test(value);

    if (!isNumber) {
        if (isPositive) return commonErrMsg.numberPositiveRequired;
        return commonErrMsg.numberRequired;
    }
    if (parseInt(value) === 0 && !includeZero) return commonErrMsg.numberPositiveRequired;

    return '';
}

export function validateRequiredNumber(value: any): string {
    const isNumber: boolean = noRequireNumberRegex.test(value);
    return commonValidate(value, isNumber, commonErrMsg.numOfRequired);
}

export function validateNormalNumber(value: any): string {
    if (!value) return '';
    const isNumber: boolean = noRequireNumberRegex.test(value);
    if (!isNumber) return commonErrMsg.numberRequired;
    return '';
}

export function validateRangedNumberDuration(value: any): string {
    const isNumber: boolean = numberRegex.test(value);
    if (!isNumber) return commonErrMsg.numberRequired;
    if (value < 1 || value > 65535) return commonErrMsg.numberOutOfRangeDuration;
    return '';
}

export function validateRangedDecimalNumber(value: any): string {
    if (!value && value !== 0) return commonErrMsg.required;
    const isDecimalNumber: boolean = decimalNumberRegex.test(value);
    if (!isDecimalNumber || ~~value < 0 || ~~value > 100) return commonErrMsg.decimalRequired;
    return '';
}

export function validateDecimalNumber(value: any): string {
    if (!value) return '';
    const isDecimalNumber: boolean = decimalNumberRegex.test(value);
    if (!isDecimalNumber) return commonErrMsg.decimalRequired;
    return '';
}

export function validateDecimalNumberRequired(value: any): string {
    const isDecimalNumber: boolean = decimalNumberRegex.test(value);
    return commonValidate(value, isDecimalNumber, commonErrMsg.decimalRequired);
}

export function validateIdentityCardNumber(value: any): string {
    const isIdentityNumber: boolean = value && identityCardRegex.test(value);
    if (!isIdentityNumber) return commonErrMsg.identityCardFormat;
    return '';
}

export function validatePercentNumber(
    value: any,
    errCode: string = commonErrMsg.percentNumberRequired,
    min = 0,
    max = 100
): string {
    const isDecimalNumber: boolean = percentNumberRegex.test(value);
    let error = '';
    if (!isDecimalNumber || value > max || value < min || !value)
        error = commonValidate(value, isDecimalNumber && value <= max && value >= min, errCode);
    return error;
}

export function validateFloatNumber(number) {
    if (!number || !isNaN(number)) return '';
    return commonErrMsg.numberRequired;
}

export function validateLongtitude(value: any): string {
    const isValidLng: boolean = !isNaN(value) && value >= -180 && value <= 180;
    return commonValidate(value, isValidLng, commonErrMsg.longlatRequired);
}

export function validateLatitude(value: any): string {
    const isValidLat: boolean = !isNaN(value) && value >= -90 && value <= 90;
    return commonValidate(value, isValidLat, commonErrMsg.longlatRequired);
}

export function validateYear(value: any): string {
    if (!value) return '';
    if (value.length < 4) return commonErrMsg.yearFormat;
    return value > 1900 && value <= dayjs().format(DATE_FORMAT.year) ? '' : commonErrMsg.yearStandard;
}

/** validation utils func */
type IValidateChainItem = {
    fn: (value, errCode: string) => string;
    errCode?: string;
};

export function validateChainGeneral(chain: NonEmptyArray<IValidateChainItem>, value) {
    let nodeResult;
    for (let i = 0; i < chain.length; i++) {
        const chainNode = chain[i];
        nodeResult = chainNode.fn(value, chainNode.errCode || '');
        if (nodeResult) break;
    }
    return nodeResult;
}

/**
Using In case You want to combine more validate functions
Example:
    You want to use two validate functions in one Field with custom error message:  validateRequired, validateUrl

    - create chain validation:
    const fileUploadValidationChain = useCallback(
    createValidationChain([
        {
            fn: validateRequired
        },
        {
            fn: validateUrl,
            errCode: 'common-err-msg.wait-upload-completed'
        }
    ]),
        []
    );

    - using in Field:
    <Field
        ...
        validate={fileUploadValidationChain}
        ...
    />
*/

export function createValidationChain(chain: NonEmptyArray<IValidateChainItem>) {
    return validateChainGeneral.bind(null, chain);
}

export const getFieldValidateResult = (message: string): string | true => message || true;
