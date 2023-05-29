import React, { useRef, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import { Capacitor } from '@capacitor/core';

import sqliteConnection from '../database';
import UserDataSource from '../data-sources/UserDataSource';
import { User } from '../entity/user';
import { Item } from '../entity/item';

const HomePage: React.FC = () => {
  const initializedRef = useRef(false);
  const logRef = useRef('');
  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  let errMess = '';

  const addLog = async (log: string) => logRef.current = logRef.current + log;

  const initialize = async (): Promise<void> => {
    addLog('\n* Start testing *\n');
    try {
      const connection = UserDataSource;
      const database = connection.options.database;
      // create a user
      const user = new User();
      user.firstName = 'Arthur';
      user.lastName = 'Ashe';
      user.email = 'arthur.ashe@example.com';
      const userRepository = connection.getRepository(User);
      let userToUpdate = await userRepository.findOne({
        where: {
          email: user.email,
        },
      });
      console.log(`$$$$ userToUpdate : ${JSON.stringify(userToUpdate)}`);
      if (userToUpdate != null) {
        user.id = userToUpdate.id;
      }
      await userRepository.save(user);
      // create a second user was added later to test live-reload
      const user1 = new User();
      user1.firstName = 'Dan';
      user1.lastName = 'Jeep';
      user1.email = 'dan.jeep@example.com';
      userToUpdate = await userRepository.findOne({
        where: {
          email: user1.email,
        },
      });
      console.log(`$$$$ userToUpdate : ${JSON.stringify(userToUpdate)}`);
      if (userToUpdate != null) {
        user1.id = userToUpdate.id;
      }
      await userRepository.save(user1);
      /*		await connection.manager.find(User)

        .save(user)
        .then(user => {
          addLog(`User has been saved. User id: ${user.id}\n`);
          console.log("User has been saved. User id is", user.id);
        })
        .catch(err => {
          console.log(`Error User ${err.message}`);
        });
    */
      /*					.insert(user)
      .into(Tokens)
      .values(post2)
      .onConflict(`("userId") DO UPDATE SET UUID = :uuid`)
      .setParameter("title", values.uuid)
      .execute();
    */
      // create items
      const item1 = new Item();
      item1.name = 'Iphone 12 Pro Max';
      item1.phoneNumber = 123456789;
      item1.user = user;
      const item2 = new Item();
      item2.name = 'Galaxy S21';
      item2.phoneNumber = 132456789;
      item2.user = user;
      const itemRepository = connection.getRepository(Item);
      let itemToUpdate = await itemRepository.findOne({
        where: {
          phoneNumber: item1.phoneNumber,
        },
      });
      console.log(`$$$$ itemToUpdate : ${JSON.stringify(itemToUpdate)}`);
      if (itemToUpdate != null) {
        item1.id = itemToUpdate.id;
      }
      await itemRepository.save(item1);
      itemToUpdate = await itemRepository.findOne({
        where: {
          phoneNumber: item2.phoneNumber,
        },
      });
      console.log(`$$$$ itemToUpdate : ${JSON.stringify(itemToUpdate)}`);
      if (itemToUpdate != null) {
        item2.id = itemToUpdate.id;
      }
      await itemRepository.save(item2);
      // added later to test live-reload
      const item3 = new Item();
      item3.name = 'Note 3';
      item3.phoneNumber = 732456189;
      item3.user = user1;
      itemToUpdate = await itemRepository.findOne({
        where: {
          phoneNumber: item3.phoneNumber,
        },
      });
      console.log(`$$$$ itemToUpdate : ${JSON.stringify(itemToUpdate)}`);
      if (itemToUpdate != null) {
        item3.id = itemToUpdate.id;
      }
      await itemRepository.save(item3);
      /*
    await connection.manager
        .save(item1)
        .then(item1 => {
          addLog(`Item1 has been saved. Item id: ${item1.id}\n`);
          console.log("Item has been saved. Item id is", item1.id);
        })
        .catch(err => {
          console.log(`Error Item ${err.message}`);
        });
    await connection.manager
        .save(item2)
        .then(item => {
          addLog(`Item2 has been saved. Item id: ${item.id}\n`);
          console.log("Item has been saved. Item id is", item.id);
        });
    */

      if (Capacitor.getPlatform() === 'web'&& typeof database === 'string') {        
        await sqliteConnection.saveToStore(database);
      }

      const savedItems = await connection.manager.find(Item);
      addLog(`Saved items from the db successful\n`);
      console.log('$$$ Saved items from the db: ', savedItems);
      setItems(savedItems);
      const loadedUsers = await connection
        .createQueryBuilder(User, 'user')
        .innerJoinAndSelect('user.items', 'item')
        .orderBy('user.lastName,item.name')
        .getMany();
      addLog(`Saved users from the db successful \n`);
      console.log('$$$ Saved users from the db: ', loadedUsers);
      setUsers(loadedUsers);
    } catch (e) {
      console.log((e as any).message);
      errMess = `Error: ${(e as any).message}`;
    }
  }

  useIonViewWillEnter(() => {
    if(initializedRef.current === false) {
      initialize();
      initializedRef.current = true;
    }
  });
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>          
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>                            
        <IonHeader collapse='condense'>
          <IonToolbar>          
            <IonTitle size='large'>Home</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div id="log">
          <pre>
            <p>{logRef.current}</p>
          </pre>
          <div v-if="errMess.length > 0">
            <p>{errMess}</p>
          </div>
        </div>

        <div id="items">
          <h2>Items</h2>
          <ul>
            {items && items.map((item) => 
              <li key={item.id}>
                {item.name} {item.phoneNumber}
              </li>
            )}
          </ul>
        </div>

        <div id="users">
          <h2>Users</h2>
          <ul>
            {users && users.map((user) => 
              <li key={user.id}>
                {user.firstName} {user.lastName}
                <ul>
                  {user.items && user.items.map((item) => 
                    <li key={`${user.id}-${item.id}}`}>
                      {item.name} {item.phoneNumber}
                    </li>
                  )}
                </ul>
              </li>
            )}
          </ul>
        </div>
      </IonContent>   
    </IonPage>
  );
};

export default HomePage;
