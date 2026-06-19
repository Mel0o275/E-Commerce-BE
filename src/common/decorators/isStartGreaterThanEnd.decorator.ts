import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

@ValidatorConstraint({ name: 'IsBefore', async: false })
export class IsBeforeConstraint implements ValidatorConstraintInterface {

    validate(value: Date, args: ValidationArguments): boolean {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];

        if (!value || !relatedValue) return true;

        return new Date(value).getTime() < new Date(relatedValue).getTime();
    }

    defaultMessage(args: ValidationArguments): string {
        const [relatedPropertyName] = args.constraints;
        return `${args.property} must be before ${relatedPropertyName}`;
    }
}

export function IsBefore(
    property: string,
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: IsBeforeConstraint, // <-- هنا التصحيح
        });
    };
}