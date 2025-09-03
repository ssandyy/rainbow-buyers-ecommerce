import NavbarWrapper from "@/components/application/NavbarWrapper"

const Websitelayout = ({ children }: any) => {
    return (
        <div>
            <NavbarWrapper />
            {children}
        </div>
    )
}

export default Websitelayout