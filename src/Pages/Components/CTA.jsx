import React from 'react';


export default function CTA() {
    
    const handleLogin = () => {
        Navigate()
            
    }
    const arrow = '\u2192';
  return (
        <section>
		<section className="ezy__cta16 py-14 md:py-24 bg-black dark:bg-[#0b1727] text-white z-[1] relative">
			<span className=" flex justify-end p4 absolute w-full h-[8%] -z-[1] top-0 right-0 bg-black dark:bg-opacity-80">
                <div className='my-3 mx-4'>
                <button onClick = {handleLogin} className='px-10 py-2 mx-5 rounded hover:text-white hover:bg-blue-600'>Login</button>
                <button className = 'bg-blue-600 px-10 py-2  rounded'>Signup</button>
                </div>
                </span>

			<span className="absolute w-full h-[39%] -z-[1] bottom-0 left-0 bg-white dark:bg-opacity-80"></span>

			{/* <div className="container relative px-4"> */}
				<div className="grid grid-cols-12 justify-center items-center">
					<div className="col-span-12 bg-black min-h-[80vh] flex flex-col justify-center items-center py-14 px-4 md:px-20 w-full text-center">
						<h1 className="text-3xl md:text-[52px] lg:text-[65px] font-bold leading-tight mb-6">
							Wanting to boost your
							<span className="text-blue-600"> productivity</span>
                            ?
						</h1>
						<p className="text-lg leading-6 opacity-80 px-0 md:px-12">
                            Become a FocusForge member and start for FREE!
						</p>
						<div className="text-center mt-12">
							<button className="bg-blue-600 border border-blue-600 text-white hover:bg-opacity-90 px-8 py-3 rounded transition m-2">
								Learn More {arrow}
							</button>
							<button className="bg-transparent text-blue-600 border border-blue-600 hover:text-white hover:bg-blue-600 px-8 py-3 rounded transition m-2">
								Get Started
							</button>
						</div>
					</div>
				</div>
                </section>
			{/* </div> */}
            <section>
            <h1>Who we are</h1>
            </section>
		</section>
	);
};


