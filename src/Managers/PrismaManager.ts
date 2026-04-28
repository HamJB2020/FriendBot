import { PrismaClient, User } from "@prisma/client";

export interface GetOrCreteResult{
	user: User;
	isNew: boolean;
}

export class PrismaManager{
	public client: PrismaClient;

	constructor(){
		this.client = new PrismaClient({
            log: ['error', 'warn'], // Opcional: para ver alertas en consola
        });
	}

	async createUser(discordId: string, name: string): Promise<User>{
		return await this.client.user.create({
			data: {
				discordId, 
				name, 
				shipLevel: 0,
				xp: 0
				//shipTime por default es ahora
			}
		});
	}

	async getUser(discordId: string): Promise<User | null> {
	    return await this.client.user.findUnique({
	        where: { discordId }
	    });
	}

	async getOrCreate(discordId: string, name: string): Promise<GetOrCreteResult>{
		const user = await this.getUser(discordId);
		if(user) return {user, isNew: false};

		const newUser = await this.createUser(discordId, name);
		return {user: newUser, isNew: true};
	}

	async addXp(discordId: string, amount: number): Promise<User | null> {
	    const user = await this.getUser(discordId);
	    if (!user) return null;

	    let newXp = user.xp + amount;
	    let newLevel = user.shipLevel;
	    const xpNextLevel = 100; 

	    if (newXp >= xpNextLevel) {
	        newLevel += Math.floor(newXp / xpNextLevel);
	        newXp = newXp % xpNextLevel; 
	    }

	    return await this.client.user.update({
	        where: { discordId },
	        data: { 
	            xp: newXp, 
	            shipLevel: newLevel,
	        }
	    });
	}
}


export const db = new PrismaManager();