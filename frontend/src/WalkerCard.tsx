interface Props {
    name: string,
    image_url: string
}

const WalkerCard = ({name}: Props) => {

    // to be replaced with our own logo/placeholder
    const img_placeholder_url = "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/dog-walker-logo-design-template-f2fabdd56851e494f58fb6ebbe455cfc_screen.jpg"

  return (
    <div>
        <h3>{name}</h3>
        <img src={img_placeholder_url} width="200" height="200"/>
    </div>
  )
}

export default WalkerCard