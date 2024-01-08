import type { BaseScalar, IServiceConfig } from './type';

class ServiceConfig implements IServiceConfig {
	public static getInstance() {
		if (this._instance) {
			return this._instance;
		}

		this._instance = new this();

		return this._instance;
	}

	private static _instance: ServiceConfig;

	private config: Record<string, unknown> = {};

	public get<T = BaseScalar>(key: string): T {
		return (this.config[key] ?? process.env[key]) as T;
	}

	public set<T>(key: string, obj: T) {
		this.config[key] = obj;
	}
}

export { ServiceConfig };
