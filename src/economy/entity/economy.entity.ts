import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity("economy")
export class Economy {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    money: number;

    @Column()
    bank: number;

    // 인벤토리
    @Column()
    inventory: string;
}
