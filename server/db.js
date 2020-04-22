const Pool = require("pg").Pool;
const PgTool = require("pgtools");
const tables = require("./tablesList.json");

const dbConnection = {
    user: "postgres",
    password: "87361339",
    host: "localhost",
    port: 5432,
}

const pool = new Pool({
    user: dbConnection.user,
    password: dbConnection.password,
    host: dbConnection.host,
    port: dbConnection.port,
    database: "perntodo"
});

async function CreateDatabase(){
    return new Promise((resolve,rej)=>{
        try {
            PgTool.createdb(dbConnection,"perntodo",(err,res)=>{
                if(err){
                    if(err.name == "duplicate_database"){
                        console.log("[INFO] Database already exists.")
                        resolve(0);
                    }else{
                        console.error("[ERROR] Cannot create database.")
                        console.log(err);
                        process.exit(1);
                    }
                }else{
                    console.log("[INFO] Database Created.")
                    resolve(0);
                }
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }
    )
}

async function CreateTables(){
    for(i in tables.tablesList){
        table = tables.tablesList[i];
        await PromiseCreateTables(table);
        await populateTable(table);
    }

}
async function PromiseCreateTables(table){
    return new Promise((resolve,rej)=>{
        try {
            pool.query(table.definition,(err,res)=>{
                if(err){
                    if(err.code=="42P07"){
                        console.log(`[INFO] Table ${table.name.toUpperCase()} already exists.`);
                        resolve(0);
                    }else{
                        console.error(`[ERROR] Cannot Create table ${table.name.toUpperCase()}.`);
                        console.log(err);
                        process.exit(1);
                    }
                }else{
                    console.log(`[INFO] Table ${table.name.toUpperCase()} created.`);
                    resolve(0);
                }
            })
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    });
}

async function populateTable(table){
    if(table.populate){
        for(i in table.populate){
            await PromisePopulateTable(table.name, table.populate[i]);
        }
    }
}

async function PromisePopulateTable(tableName, tablePopulate){
    return new Promise((resolve,reject) =>{
        try {
            pool.query(tablePopulate,(err,rej)=>{
                if(err){
                    console.error(err);
                    process.exit(1);
                }else{
                    console.log(`[INFO] Table ${tableName.toUpperCase()} populated`);
                    resolve(0);
                }
            })
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    })
}

async function initialize(drop){
    if(drop){
        console.log("Dropping database...");
        await dropDatabese();
        console.log(">>> Database Dropped.");
    }
    console.log("Initializing database...");
    await CreateDatabase();
    await CreateTables();
    console.log(">>> Database initialized. Ready to go!");
}


async function dropDatabese(){
    return new Promise((resolve,rej)=>{
        try{
            PgTool.dropdb(dbConnection,"perntodo",(err,res)=>{
                if(err){
                    if(err.name = "3D000"){
                        console.log("[INFO] Database doesn't exist.")
                        resolve(0);
                    }else{
                        console.error("[ERROR] Cannot drop database.")
                        console.log(err);
                        process.exit(1);
                    }
                }else{
                    console.log("[INFO] Database Dropped");
                    resolve(0);
                }
            });
        }catch(error){
            console.error(error);
            process.exit(1);
        }
    });
}

module.exports = {
    pool:pool,
    initialize:initialize,
}