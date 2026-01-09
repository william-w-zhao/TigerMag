const Masthead = () => {
  const currentYear = new Date().getFullYear();

  const chairperson = 'Yara Almoussa'
  const editor = 'Gavin Stroud'
  const businessmanager = 'Boshi Dong and William Zhao'
  const artdirector = 'Abby Czuchlewski and Caroline Naughton'
  const secretary = 'Elena Eiss'
  const socialchair = 'Charlotte Sussman'
  const socialmedia = 'Geoff Liu'
  const webmaster = 'William Zhao'
  const historian = 'Bram Raftery'
  const publicfigure = 'Vihaan, Lucy, Nate, Xiyan'

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center text-center gap-4">
        <h1 className="text-3xl font-bold mb-4">
          Masthead {currentYear}
        </h1>

        <div>
          <h2 className="text-xl font-bold">Chairperson</h2>
          <p className="text-xl">{chairperson}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Editor-in-Chief</h2>
          <p className="text-xl">{editor}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Business Managers</h2>
          <p className="text-xl">{businessmanager}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Art Directors</h2>
          <p className="text-xl">{artdirector}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Secretary</h2>
          <p className="text-xl">{secretary}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Social Chair</h2>
          <p className="text-xl">{socialchair}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Social Media Director</h2>
          <p className="text-xl">{socialmedia}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Webmaster</h2>
          <p className="text-xl">{webmaster}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Historian</h2>
          <p className="text-xl">{historian}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Public Figures</h2>
          <p className="text-xl">{publicfigure}</p>
        </div>
      </div>
    </div>
  );
};

export default Masthead;
