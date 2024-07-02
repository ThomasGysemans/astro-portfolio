export class ActionResponse {
    public constructor(
        public status: number = 200,
        public details: string | undefined = undefined,
    ) {}
}