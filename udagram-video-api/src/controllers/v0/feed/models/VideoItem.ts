import {
  Table,
  Column,
  Model,
  HasMany,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from "sequelize-typescript";

@Table
export class VideoItem extends Model<VideoItem> {
  @Column
  public caption!: string;

  @Column
  public description!: string;

  @Column
  public url!: string;

  @Column
  @CreatedAt
  public createdAt: Date = new Date();

  @Column
  @UpdatedAt
  public updatedAt: Date = new Date();
}
