import React, { useEffect, useState } from 'react';

import socials from '../constants/socials';

const Card = () => {
  const handleShareClick = () => {
    navigator.share({
      url: window.location.href,
      title: 'Eduardo Bonilla Santos · Senior Data Analyst',
    });
  };

  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(
      typeof navigator !== 'undefined' && typeof navigator.share === 'function',
    );
  }, []);

  return (
    <main className='card align-center-wrap'>
      <div className='grid p-1'>
        <div className='card-container col-10 offset-1 col-phone-12 offset-phone-0 col-tablet-8 offset-tablet-2'>
          <div className='grid'>
            <div className='copy col-12'>
              <div className='heading'>
                <h4>Eduardo Bonilla Santos</h4>
                <h6 className='font-weight-300'>
                  <i>Senior Data Analyst</i>
                </h6>
                <h6 className='font-weight-300'>
                  <i>Gaming Intelligence &amp; Analytics Engineering</i>
                </h6>
                <h6 className='font-weight-300'>
                  <a href='mailto:eduardo_trabajos007@outlook.com'>
                    eduardo_trabajos007@outlook.com
                  </a>
                </h6>
                <h6 className='font-weight-300'>San Juan, PR</h6>
              </div>
              <div className='links'>
                {Object.keys(socials).map((name, i) => {
                  return (
                    <a
                      href={socials[name]}
                      target='_blank'
                      rel='noopener noreferrer'
                      key={i}
                    >
                      <i className={`fab fa-${name} fa-2x`}></i>
                    </a>
                  );
                })}
              </div>
              {canShare && (
                <i
                  className='fa fa-share fa-2x share'
                  onClick={handleShareClick}
                ></i>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Card;
