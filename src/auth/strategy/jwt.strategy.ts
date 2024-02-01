import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { TEST_JWT_SECRET } from "../../../config/appConstants.json";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends  PassportStrategy(Strategy, 'jwt') {
    constructor( config: ConfigService, private prisma: PrismaService ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:  config.get("TOKEN_SECRET") || TEST_JWT_SECRET
        })
    }

    async validate(
        payload: {
            sub: number;
            email: string;
        }) {

        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        });

        delete user.hashPassword;
        return user;
    }
}