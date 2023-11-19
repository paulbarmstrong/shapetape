import { AnyClassConstructor, DictShape, Literal, LiteralShape, Shape, UnionShape } from "./Types"
import { getGlobalRegex } from "./Utilities"

export const s = {
	string: function(options?: { condition?: (entity: string) => boolean, regex?: RegExp }) {
		const regex: RegExp | undefined = options?.regex !== undefined ? (
			getGlobalRegex(options?.regex)
		) : (
			undefined
		)
		const condition = options?.condition !== undefined || regex !== undefined ? (
			(entity: string) => {
				return (options?.condition === undefined || options.condition(entity)) && (regex === undefined || regex.test(entity))
			}
		) : (
			undefined
		)
		return { type: "string" as "string", condition: condition }
	},
	number: function(options?: { condition?: (entity: number) => boolean, lowerBound?: number, upperBound?: number }) {
		const condition = options?.condition !== undefined || options?.lowerBound !== undefined || options?.upperBound !== undefined ? (
			(entity: number) => {
				return (options?.condition === undefined || options.condition(entity)) &&
					(options?.lowerBound === undefined || entity >= options?.lowerBound) &&
					(options?.upperBound === undefined || entity <= options?.upperBound)
			}
		) : (
			undefined
		)
		return { type: "number" as "number", condition: condition }
	},
	boolean: function() {
		return { type: "boolean" as "boolean" }
	},
	literal: function<T extends Literal>(literal: T) {
		return { type: "literal" as "literal", data: literal }
	},
	dict: function<T extends { [key: string]: Shape }>(dict: T, options?: { condition?: (entity: { [key: string]: any }) => boolean }) {
		return { type: "dict" as "dict", data: dict, condition: options?.condition }
	},
	array: function<T extends Shape>(shape: T, options?: { condition?: (arr: Array<any>) => boolean }) {
		return { type: "array" as "array", data: shape, condition: options?.condition }
	},
	union: function<T extends Array<Shape>>(subShapes: T) {
		return { type: "union" as "union", data: subShapes }
	},
	class: function<T extends AnyClassConstructor>(clazz: T, options?: { condition?: (instance: InstanceType<T>) => boolean } ) {
		return { type: "class" as "class", data: clazz, condition: options?.condition }
	},
	optional: function<T extends Shape>(shape: T) {
		return { type: "union" as "union", data: [shape, { type: "literal" as "literal", data: undefined }] }
	},
	integer: function(options?: { lowerBound?: number, upperBound?: number }) {
		function condition(entity: number) {
			return Number.isInteger(entity) &&
				(options?.lowerBound === undefined || entity >= options?.lowerBound) &&
				(options?.upperBound === undefined || entity <= options?.upperBound)
		}
		return { type: "number" as "number", condition: condition }
	}
}

export function getDictShapeKeys<T extends DictShape>(shape: T): Array<string> {
	return Object.keys(shape.data)
}

export function getUnionShapeSubShapes<T extends UnionShape>(shape: T): Array<Shape> {
	return shape.data
}

export function getLiteralShapeValue<T extends LiteralShape>(shape: T): Literal {
	return shape.data
}