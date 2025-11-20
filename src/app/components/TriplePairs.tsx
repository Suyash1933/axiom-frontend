import PairsList from "./PairsList";

export default function TriplePairs() {
  return (
    <div className="w-full px-6 md:px-10 py-6 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

        <PairsList title="New Pairs" />
        <PairsList title="Final Stretch" />
        <PairsList title="Migrated" />

      </div>
    </div>
  );
}
