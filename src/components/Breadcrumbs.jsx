import { IoMdHome } from "react-icons/io";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items = [] }) => {
    return (
        <div className="breadcrumbs text-md text-gray-700 mb-3">
            <ul>
                <li>
                    <Link to="/">
                        <IoMdHome size={20} className="dark-blue" />
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="dark-blue font-semibold">
                        {item.to ? (
                            <Link to={item.to}>{item.label}</Link>
                        ) : (
                            <span>{item.label}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Breadcrumbs;
