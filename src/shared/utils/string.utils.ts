/**
 * Transform a string to a capitalize string
 * @param item
 * @returns {string}
 */
export const capitalize = (input: string): string => {
    if (typeof input !== 'string') {
        return input;
    }
    return input.charAt(0).toUpperCase() + input.slice(1);
};

export const normalizeVietnameseCharacter = (input: string, isReplaceWhitespaceToHyphen = false) => {
    if (input === undefined || input === '') return '';
    let slug = input.toLowerCase();

    slug = slug.replace(/[áàảạãăắằẳẵặâấầẩẫậ]/gi, 'a');
    slug = slug.replace(/[éèẻẽẹêếềểễệ]/gi, 'e');
    slug = slug.replace(/[iíìỉĩị]/gi, 'i');
    slug = slug.replace(/[óòỏõọôốồổỗộơớờởỡợ]/gi, 'o');
    slug = slug.replace(/[úùủũụưứừửữự]/gi, 'u');
    slug = slug.replace(/[ýỳỷỹỵ]/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    slug = slug.replace(/[`~!@#|$%^&*()+=,./?><'":;_]/gi, '');
    if (isReplaceWhitespaceToHyphen) {
        slug = slug.replace(/ /gi, '-');
    }
    slug = slug.replace(/-----/gi, '-');
    slug = slug.replace(/----/gi, '-');
    slug = slug.replace(/---/gi, '-');
    slug = slug.replace(/--/gi, '-');

    slug = `@${slug}@`;
    slug = slug.replace(/@-|-@|@/gi, '');

    return slug;
};
