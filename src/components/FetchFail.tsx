export default function FetchFail({error}: { error?: string }) {
    return (
        <div>
            {error ? error : 'Failed to fetch data'}
        </div>
    );
}