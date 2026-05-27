import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

@ValidatorConstraint({ name: 'Match_Between_Fields', async: false })
export class MatchBetweenFields<T> implements ValidatorConstraintInterface {
    validate(value: T, args: ValidationArguments) {
        return (args.object as any)[args.constraints[0]] == value;        // return text.length > 1 && text.length < 10; // for async validations you must return a Promise<boolean> here
    }

    defaultMessage(args: ValidationArguments) {
        // here you can provide default error message if validation failed
        return 'Missmatch between password and confirm password';
    }
}





export function IsMatch<T>(constraints: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints,
            validator: MatchBetweenFields<T>,
        });
    };
}