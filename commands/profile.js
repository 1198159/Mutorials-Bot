const { Console } = require('console');
const fs = require('fs') 

module.exports = {
    name: 'profile',
    description: 'profile stuff',
    
    execute(bot, msg, args) {
      this.getRank(msg, msg.author);
    },
    getRank(msg, user){
      var ranking = 0;
      fs.readFile('./data/profiles.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading file from disk: ${err}`);
        } else {
            const databases = JSON.parse(data);
            var included = false;
            databases.forEach(db => {
              if(db.id === user.id && !included){
                included = true;
                ranking = db.rank;
                msg.channel.send(`Your ranking: is ${ranking}`);
              }
            });
            
            if(!included){
              databases.push({
                id: user.id,
                rank: 0
            });
            msg.channel.send(`Your ranking is: 0`);
            }
            fs.writeFile('./data/profiles.json', JSON.stringify(databases, null, 4), (err) => {
              if (err) {
                  console.log(`Error writing file: ${err}`);
              }
          });
        }
        
        });
        
    },
    setRank(user, edit){
      fs.readFile('./data/profiles.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading file from disk: ${err}`);
        } else {
    
            const databases = JSON.parse(data);
            var temp = false;
            databases.forEach(db => {
              if(db.id === user.id && !temp){
                //rank calculations here
                db.rank+=edit;
                console.log(`changed ${user.id} rank to ${db.rank}`);
                temp = true;
              }
            });
            // write new data back to the file
            fs.writeFile('./data/profiles.json', JSON.stringify(databases, null, 4), (err) => {
                if (err) {
                    console.log(`Error writing file: ${err}`);
                }
            });
        }
    
    });
    }
  };