import "./Tag.scss";

type Props = {
  title: string;
};

export default function Tag({ title = "Все" }: Props) {
  return <button className="category_tag">{title}</button>;
}
