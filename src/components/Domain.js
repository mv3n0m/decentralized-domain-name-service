import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

const Domain = ({ domain, ethDaddy, provider, id }) => {
  const [ owner, setOwner ] = useState(null)
  const [ isSold, setIsSold ] = useState(false)

  const getOwner = async () => {
    if (domain.isOwned || isSold) {
      const owner = await ethDaddy.ownerOf(id)
      setOwner(owner)
    }
  }

  const handlePurchase = async () => {
    const signer = await provider.getSigner()
    const transaction = await ethDaddy.connect(signer).mint(id, { value: domain.cost })
    await transaction.wait()
    setIsSold(true)
  }

  useEffect(() => {
    getOwner()
  }, [ isSold ])


  return (
    <div className='card'>
      <div className="card__info">
        {
          domain.isOwned || owner ? (
            <>
              <h3><del>{ domain.name }</del></h3>
              <p><small>Owned by: <br/> <span>{ owner && owner.slice(0, 6) + "....." + owner.slice(-4) }</span></small></p>
            </>
          ) : (
            <>
              <h3>{ domain.name }</h3>
              <p><strong>{ ethers.utils.formatUnits(domain.cost.toString(), 'ether') }</strong>ETH</p>
            </>
          )
        }
      </div>
      { domain.isOwned && owner ? <></> : <button className='card__button' onClick={ handlePurchase }>Buy it</button> }
    </div>
  );
}

export default Domain;