import "./cards.css";

type Props = {
  image: string;
  name: string;
  rarity: string;
  price: number;
};

export function Cards({ image, name, rarity, price }: Props) {
  const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

  return (
    <article className="card" aria-label={name}>
      <figure className="card__media">
        <img
          src={image}
          alt={name}
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.png"; }}
        />
      </figure>

      <div className="card__body">
        <h2 className="card__title">{name}</h2>
        <div className="card__row">
          <span className="chip chip--rarity">{rarity}</span>
        </div>
      </div>

      <footer className="card__footer">
        <span className="price__label">Value</span>
        <span className="price__amount">{fmt.format(price)}</span>
      </footer>
    </article>
  );
}
