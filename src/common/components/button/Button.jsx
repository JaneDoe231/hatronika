import { Colors, Images } from 'common/constants';

import
	styles
from './Button.module.css';
import { Loader } from '..';

export const Button = ({
	type,
	text,
	icon,
	style,
	textStyle,
	onClick,
	disabled,
	loading
}) => {
	// type: primary, primaryoutline, secondary, white

	let bgColor, txtColor, border = 'none';

	switch (type) {
		case 'primary':
			bgColor = Colors.primary;
			txtColor = Colors.white;
			break;
		case 'primaryoutline':
			bgColor = 'transparent';
			txtColor = Colors.primary;
			border = `1px solid ${Colors.primary}`;
			break;
		case 'secondary':
			bgColor = Colors.secondary;
			txtColor = 'white';
			break;
		case 'secondaryoutline':
			bgColor = 'transparent';
			txtColor = Colors.secondary;
			border = `2px solid ${Colors.secondary}`;
			break;
		case 'whiteoutline':
			bgColor = 'transparent';
			txtColor = Colors.white;
			border = `1px solid ${Colors.white}`;
			break;
		case 'white':
			bgColor = Colors.white;
			txtColor = Colors.black;
			break;
	}

	return (
		<div
			className={styles.btnContainer}
			style={{ backgroundColor: disabled ? Colors.pendingGray : bgColor, border, ...style }}
			onClick={!loading && !disabled ? onClick && typeof onClick === 'function' && onClick : undefined}
		>
			{ loading
				? <Loader style={{ width: '24px', height: '24px' }}/>
				: <>
						{
							icon &&
							<img
								className={styles.iconImg}
								src={Images.Icons[icon]}
							/>
						}
						<div
							className={styles.btnText}
							style={{
								color: disabled
									? Colors.white
									: txtColor,
								...textStyle
							}}
						>
							{text}
						</div>
					</>
			}
		</div>
	);
};