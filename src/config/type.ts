export type BaseScalar = undefined | string | number;

export interface IServiceConfig {
	get<T = BaseScalar>(key: string): T;

	set<T = BaseScalar>(key: string, data: T): void;
}
