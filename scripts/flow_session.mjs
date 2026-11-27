// check:flow owns a state session until its complete setup returns to the walker.
export async function openFlowSession(session, save, setup = async () => {}) {
    try {
        await session.start();
        await session.open(save);
        await setup(session);
        return session;
    } catch (error) {
        try {await session.close();}
        catch (cleanup) {throw new AggregateError([error, cleanup], String(error.message || error) + '\nSetup cleanup also failed: ' + String(cleanup.message || cleanup), {cause:error});}
        throw error;
    }
}
