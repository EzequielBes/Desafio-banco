import { ApiProperty } from "@nestjs/swagger";

export class TokenDTO {

    @ApiProperty({example: "wiOiJlemVxdWllbHRiZXNlcnJhMkBnbWFpbC5jb20iLCJhY2NvdW50X2lkIjoiN2M4Y2ViMDgtMzA3Ni00NWY0LWI4YzAtN"})
    token: string
}