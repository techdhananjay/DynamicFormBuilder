import PropTypes from 'prop-types';

const Card = ({ children, className = '', hover = false }) => {
    const hoverClass = hover ? 'hover-lift cursor-pointer' : '';

    return (
        <div className={`glass-card p-6 ${hoverClass} ${className}`}>
            {children}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    hover: PropTypes.bool,
};

export default Card;
