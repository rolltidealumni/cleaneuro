export default ({ palette, spacing }) => ({
  MuiCard: {
    root: {
      '&.MuiProjectCard--01': {
        transition: '0.3s',
        maxWidth: 304,
        margin: 'auto',
        borderRadius: 16,
        padding: 3,
        boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
        '&:hover': {
          boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)',
        },
        '& .MuiCard__head': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          '& .MuiAvatar-root': {
            width: 60,
            height: 60,
            backgroundColor: '#ffffff',
            transform: 'translateY(50%)',
          },
          '& .MuiTypography--headLabel': {
            color: '#ECECEC',
          },
        },
        '& .MuiDivider-root': {
          marginLeft: -3,
          marginRight: -3,
        },
        '& .MuiCardContent-root': {
          textAlign: 'left',
          padding: 0,
          paddingTop: 6,
          '& .MuiTypography--overline': {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#ECECEC',
          },
          '& .MuiTypography--heading': {
            fontWeight: 900,
          },
          '& .MuiTypography--subheading': {
            lineHeight: 1.8,
          },
        },
      },
    },
  },
});