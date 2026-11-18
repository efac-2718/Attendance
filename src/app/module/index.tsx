import { Link } from 'expo-router';
import { FlatList, Pressable } from "react-native";
import ModuleCard from '../../components/ModuleCard';

const MODULES = [
    { id: '1', code: 'BECS 32272', name: 'Mobile Application Dev', attended: 22, held: 24, target: 80 },
    { id: '2', code: 'BECS 32453', name: 'Digital Signal Processing', attended: 20, held: 24, target: 80 },
     { id: '3', code: 'COSC 34122', name: 'Cyber Security', attended: 17, held: 24, target: 80 },
];

export default function modules() {
    return(
        <FlatList
            data={MODULES}
            keyExtractor= {(item) => item.id}
            renderItem={({ item }) => (
                <Link href={{ pathname: '/module/[id]', params: { id: item.id } }}
                 asChild>
                    <Pressable>
                        <ModuleCard module={item} />
                    </Pressable>
                </Link>
            )}
            contentContainerStyle={{ padding: 16 }}
        />
    );
}
