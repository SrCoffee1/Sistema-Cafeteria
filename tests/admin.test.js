//admin.test.js

// Mockando o Firebase para testes rápidos
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(() => ({}))
  }));
  
  jest.mock('firebase/firestore', () => {
    // Armazenamento em memória para simular o Firestore
    const mockDB = {
      funcionarios: {
        func1: { nome: "João", cargo: "Gerente" }
      }
    };
    
    return {
      getFirestore: jest.fn(() => ({})),
      doc: jest.fn((_, colecao, id) => ({ id, colecao, ref: { id, colecao } })),
      collection: jest.fn((_, colecao) => ({ colecao })),
      setDoc: jest.fn((docRef, data) => {
        if (!mockDB[docRef.colecao]) mockDB[docRef.colecao] = {};
        mockDB[docRef.colecao][docRef.id] = data;
        return Promise.resolve();
      }),
      updateDoc: jest.fn((docRef, data) => {
        Object.assign(mockDB[docRef.colecao][docRef.id], data);
        return Promise.resolve();
      }),
      deleteDoc: jest.fn((docRef) => {
        delete mockDB[docRef.colecao][docRef.id];
        return Promise.resolve();
      }),
      getDocs: jest.fn((collectionRef) => {
        const docs = Object.entries(mockDB[collectionRef.colecao] || {}).map(([id, data]) => ({
          id,
          data: () => data,
        }));
        
        return Promise.resolve({
          empty: docs.length === 0,
          docs,
          forEach: (callback) => docs.forEach(callback),
        });
      })
    };
  });
  
  jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({})),
    signOut: jest.fn(() => Promise.resolve())
  }));
  
  // Importações (mesmo que antes)
  import { initializeApp } from "firebase/app";
  import { getFirestore, doc, setDoc, getDocs, collection, updateDoc, deleteDoc } from "firebase/firestore";
  import { getAuth, signOut } from "firebase/auth";
  
  let db;
  let auth;
  
  beforeAll(() => {
      const firebaseConfig = {
          apiKey: "AIzaSyBH7TLYmt4zmLRZUDi1JsvZBVkdyd5tMuo",
          authDomain: "cafeteria-e2deb.firebaseapp.com",
          projectId: "cafeteria-e2deb",
          storageBucket: "cafeteria-e2deb.appspot.com",
          messagingSenderId: "782094081343",
          appId: "1:782094081343:web:8710947f6e7617c7bc078a"
      };
  
      // Inicialização agora é instantânea pois é mockada
      const app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
      
      // Não precisamos mais criar o funcionário aqui - já está no mockDB
  });
  
  describe("Teste de Funcionários", () => {
      test("Deve carregar funcionários", async () => {
          const snapshot = await getDocs(collection(db, "funcionarios"));
          expect(snapshot.empty).toBe(false);
          expect(snapshot.docs.length).toBeGreaterThan(0);
      });
  
      test("Deve editar funcionário", async () => {
          const ref = doc(db, "funcionarios", "func1");
          await updateDoc(ref, { nome: "João Atualizado" });
  
          const updated = await getDocs(collection(db, "funcionarios"));
          const funcionario = updated.docs.find(doc => doc.id === "func1").data();
          expect(funcionario.nome).toBe("João Atualizado");
      });
  
      test("Deve excluir funcionário", async () => {
          const ref = doc(db, "funcionarios", "func1");
          await deleteDoc(ref);
  
          const afterDelete = await getDocs(collection(db, "funcionarios"));
          const deletedFuncionario = afterDelete.docs.find(doc => doc.id === "func1");
          expect(deletedFuncionario).toBeUndefined();
      });
  
      test("Deve realizar logout", async () => {
          await expect(signOut(auth)).resolves.not.toThrow();
      });
  });
  