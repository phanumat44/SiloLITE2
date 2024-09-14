require('dotenv').config();


const mqtt = require('./config/mqttConfig');
const { pool, mysql } = require('./config/mysqlConfig');



mqtt.on("connect", () => {
    mqtt.subscribe("data/db_change_events", (err) => {
        if (!err) {
            console.log("Subscribed to db_change_events");
        }
    });

    mqtt.on('message', (topic, message) => {
        const data = JSON.parse(message.toString());

        console.log(topic);

        /*  console.log(data); */

        console.log(topic === 'data/db_change_events');

        if (topic === 'data/db_change_events') {

            console.log(data.topic === 'db.silo.material');
            switch (data.topic) {
                case 'db.silo.material':         
                case 'db.silo.silo':
                case 'db.silo.radar':
                    TableDataChanged(data);
                    break;
                default:
                    console.log('Unknown kafka topic:', data.topic);
                    break;
            }
        } else {
            console.log('Unknown mqtt topic:', topic);
        }


    });
});

const InsertAndUpdate = async (data, tableName) => {

    console.log(tableName);
    console.log(data);

    let connection;
    let isExist = false;

    try {
        connection = await pool.getConnection();

        console.log(`SELECT * FROM ${mysql.escapeId(tableName)} WHERE ${mysql.escapeId('row')} = ?;`);

        const [results] = await connection.execute(`SELECT * FROM ${mysql.escapeId(tableName)} WHERE ${mysql.escapeId('row')} = ?;`, [data.row]);

        console.log(results);
        isExist = results.length > 0;



        console.log("Exist :" + isExist)

        if (!isExist) {
            let query = '';
            let arrData = [];

            if (tableName === 'material') {
                query = 'INSERT INTO `material` (`row`,`material_id`, `material_type`, `material_name`, `material_density`, `material_lot`, `material_discription`) VALUES (?, ?, ?, ?, ?, ?,?)';
                arrData = [data.row, data.material_id, data.material_type, data.material_name, data.material_density, data.material_lot, data.material_discription];
            }
            else if (tableName === 'silo') {
                query = 'INSERT INTO `silo` (`row`,`silo_id`,`silo_type`,`silo_name`,`silo_latitude`,`silo_longitude`,`silo_capacity`,`station_row`,`radar_row`,`material_row`,`HH`,`H`,`L`,`LL`) VALUES (? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,?,?,?)';
                arrData = [data.row, data.silo_id, data.silo_type, data.silo_name, data.silo_latitude, data.silo_longitude, data.silo_capacity, data.station_row, data.radar_row, data.material_row, data.HH, data.H, data.L, data.LL];
            }
            else if (tableName === 'radar') {
                query = 'INSERT INTO `radar` (`row`,`radar_id`,`radar_type`,`radar_name`,`loop_name`) VALUES (? ,? ,? ,? ,? )';
                arrData = [data.row, data.radar_id, data.radar_type, data.radar_name, data.loop_name];
            } else {
                throw new Error("Unknown table name");
            }

            const [results, fields] = await connection.execute( query,arrData)

            console.log(`Inserted data to ${tableName} row ${data.row} : `, results);

        } else {
            let query = '';
            let arrData = [];

            console.log(tableName === 'material')

            if (tableName === 'material') {
                query = 'UPDATE `material` SET `material_id` = ?, `material_type` = ?, `material_name` = ?, `material_density` = ?, `material_lot` = ?, `material_discription` = ? WHERE `row` = ?';
                arrData = [data.material_id, data.material_type, data.material_name, data.material_density, data.material_lot, data.material_discription, data.row.toString()];
            }
            else if (tableName === 'silo') {
                query = 'UPDATE `silo` SET `silo_id` = ?, `silo_type` = ?, `silo_name` = ?, `silo_latitude` = ?, `silo_longitude` = ?, `silo_capacity` = ?, `station_row` = ?, `radar_row` = ?, `material_row` = ?, `HH` = ?, `H` = ?, `L` = ?, `LL` = ? WHERE `row` = ?';
                arrData = [data.silo_id, data.silo_type, data.silo_name, data.silo_latitude, data.silo_longitude, data.silo_capacity, data.station_row, data.radar_row, data.material_row, data.HH, data.H, data.L, data.LL, data.row.toString()];
            }
            else if (tableName === 'radar') {
                query = 'UPDATE `radar` SET `radar_id` = ?, `radar_type` = ?, `radar_name` = ?, `loop_name` = ? WHERE `row` = ?';
                arrData = [data.radar_id, data.radar_type, data.radar_name, data.loop_name, data.row.toString()];
            } else {
                throw new Error("Unknown table name");
            }
            const [results, fields] = await connection.execute(query,arrData)
            
            console.log(`Updated table ${tableName} row ${data.row} : `, results);
        }



    } catch (err) {
        console.error(err);
    } finally {
        if (connection) connection.release();
    }

}

const Delete = async (row,schemaName) => {
    let connection;
    try {
        connection = await pool.getConnection();

        if (schemaName.includes('material')) {
            const [results] = await connection.execute('DELETE FROM `material` WHERE `row` = ?', [row]);
            console.log(`Deleted data from material row ${row} : `, results);
            
        } else if (schemaName.includes('silo')){
            const [results] = await connection.execute('DELETE FROM `silo` WHERE `row` = ?', [row]);
            console.log(`Deleted data from silo row ${row} : `, results);

        } else if (schemaName.includes('radar')){
            const [results] = await connection.execute('DELETE FROM `radar` WHERE `row` = ?', [row]);
            console.log(`Deleted data from radar row ${row} : `, results);
        }

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) connection.release();
    }
}

function TableDataChanged(data) {

    const { topic, key, value, offset } = data;
    console.log("==================== Data =========================")
    console.log('Topic:', topic);
    console.log('Key:', key);
    console.log('Value:', value);
    console.log('Offset:', offset);
    console.log("====================================================")

    const operation = value?.payload.op || null;
    const payload = value?.payload;

    switch (operation) {
        case 'c':
        case 'u':
            console.log("operation :", operation);
            InsertAndUpdate(payload.after, payload.source.table);
            break;
        case null:
            console.log('deleted:', key.payload.row,key.schema.name);
            Delete(key.payload.row,key.schema.name);
            break;
        default:
            console.log('Unknown operation:', operation);
            break;
    }


    /*    const { id, name, description } = material;
       mysql.query('update material set name = ?, description = ? where id = ?', [name, description, id], (err, results, fields) => {
           if (err) {
               console.error(err);
               return;
           }
           console.log('Material updated:', results);
       }); */
}



