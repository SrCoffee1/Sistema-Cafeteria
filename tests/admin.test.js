import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, collection, updateDoc, deleteDoc } from "firebase/firestore"; // Adicione a importação de collection aqui
import { getAuth, signOut } from "firebase/auth";

let db;
let auth;

beforeAll(async () => {
    const firebaseConfig = {
        apiKey: "AIzaSyBH7TLYmt4zmLRZUDi1JsvZBVkdyd5tMuo",
        authDomain: "cafeteria-e2deb.firebaseapp.com",
        projectId: "cafeteria-e2deb",
        storageBucket: "cafeteria-e2deb.appspot.com",
        messagingSenderId: "782094081343",
        appId: "1:782094081343:web:8710947f6e7617c7bc078a"
    };

    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    // Adicionando um funcionário de exemplo antes de rodar os testes
    const funcionarioRef = doc(db, "funcionarios", "func1");
    await setDoc(funcionarioRef, {
        nome: "João",
        cargo: "Gerente"
    });
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
