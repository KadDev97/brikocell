export const openDB = (name, version) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onerror = (event) => {
      console.error('Error al abrir la base de datos:', event.target.error);
      reject(new Error('No se pudo abrir la base de datos'));
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('repairs')) {
        db.createObjectStore('repairs', { keyPath: 'id' });
      }
    };
  });
};

export const saveData = async (db, storeName, data) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    const request = store.put(data); // 'put' para actualizar o insertar nuevos datos

    request.onsuccess = () => {
      resolve('Datos guardados correctamente');
    };

    request.onerror = (event) => {
      reject(new Error('Error al guardar los datos: ' + event.target.error));
    };
  });
};

export const getData = async (db, storeName) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);

    const request = store.getAll(); // Recuperamos todos los registros

    request.onsuccess = () => {
      resolve(request.result); // Retornamos los registros
    };

    request.onerror = (event) => {
      reject(new Error('Error al obtener los datos: ' + event.target.error));
    };
  });
};

// Agregar la función para eliminar datos
export const deleteData = async (db, storeName, id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    const request = store.delete(id); // Eliminamos el registro por ID

    request.onsuccess = () => {
      resolve('Datos eliminados correctamente');
    };

    request.onerror = (event) => {
      reject(new Error('Error al eliminar los datos: ' + event.target.error));
    };
  });
};
