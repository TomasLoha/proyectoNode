
import app from './app'
import { AppDataSource } from './conexion';



const port = 3000;

async function main(){

    try{
        await AppDataSource.initialize();
        
        app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });
    }catch(err){
        if(err instanceof Error){
            console.log(err.message);
        }
    }
}

main();