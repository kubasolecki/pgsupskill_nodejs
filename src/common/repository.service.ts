import { Model, Document } from 'mongoose';

export interface IPersistentEntity {
    id: string;
}

export interface IRepositoryService<T extends Document, Dto> {
    getById(id: string): Promise<Dto>;
    getAll(predicate: (entity: T) => boolean): Promise<Dto[]>;
    create(dto: Dto): Promise<Dto>;
    delete(id: string): Promise<void>;
    update(id: string, dto: Partial<Dto>): Promise<Dto>;
}
export abstract class RepositoryService<T extends Document, Dto>
    implements IRepositoryService<T, Dto> {
    async delete(id: string): Promise<void> {
      await this.persistentModel.findByIdAndRemove(id);
      this.onEntityDeleted(id);
    }

    async update(id: string, dto: Partial<Dto>): Promise<Dto> {
      const foundModel = await this.persistentModel.findById(id);
      return foundModel?.update(dto);
    }
    getAll(predicate: (entity: T) => boolean): Promise<Dto[]> {
        throw new Error("Method not implemented.");
    }
    create(dto: Dto): Promise<Dto> {
        const model = this.mapDtoToModel(dto);

        this.persistentModel.create(model);
        // TODO: continue :)
        throw new Error("Method not implemented.");
    }

    async getById(id: string): Promise<Dto> {
        const entity = await this.persistentModel.findById(id);

        if (!entity){
            throw new Error(`TODO: Provide some exception about entity with Id: ${id} not found`);
        }

        return this.mapModelToDto(entity);
    }

    abstract mapModelToDto(model: T): Dto;
    abstract mapDtoToModel(dto: Dto): Partial<T>;

    onEntityCreated(newModel: T): Promise<T> | T { return newModel; }
    onEntityUpdated(newModel: T): Promise<T> | T { return newModel; }
    onEntityDeleted(id: string): Promise<void> | void {}
    protected constructor(protected persistentModel: Model<T>) {

    }
}
