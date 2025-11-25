import SearchScreen from '@/src/components/Search/SearchScreen';
import SearchResults from '@/src/components/SearchResults';

export default function Home() {
    return (
        <div className={`w-full h-full flex flex-col items-center`}>
            <SearchScreen />
            <SearchResults />
        </div>
    );
}
