import React from 'react';
import { useNavigate} from 'react-router-dom';

export default function CTA() {
     const navigate = useNavigate();

    const handleLogin = () => {
       navigate('/start');
            
    }
    const arrow = '\u2192';
  return (
		<section className="ezy__cta16 py-14 md:py-24 bg-white dark:bg-[#0b1727] text-white z-[1] relative">
			<span className=" flex justify-end p4 absolute w-full h-[39%] -z-[1] top-0 right-0 bg-black dark:bg-opacity-80">
                <div className='my-3 mx-4'>
                <button onClick={handleLogin} className='px-10 py-2 mx-5 rounded hover:text-white hover:bg-blue-600'>Login</button>
                <button className = 'bg-blue-600 px-10 py-2  rounded'>Signup</button>
                </div>
                </span>

			{/* <span className="absolute w-full h-[39%] -z-[1] bottom-0 left-0 bg-white dark:bg-opacity-80"></span> */}

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
            <div className="text-center mt-20 text-blue-600">
                <h1 className="text-3xl font-bold !text-blue-600 pb-10">Our mission</h1>
                <p className='text-black px-8'>
At FocusForge, our mission is simple yet powerful: to help people do their best work without burning out.

We believe productivity isn’t about doing more—it’s about doing what matters, efficiently and mindfully. In a world overwhelmed by distractions and to-do lists, we’re building a focused environment where clarity, action, and balance come together.

Whether you're a student juggling deadlines, a creator managing multiple projects, or a team striving for seamless collaboration, our app is designed to empower you with smart tools, intuitive design, and thoughtful automation—so you can focus on progress, not process.

We’re here to redefine what productivity means: less chaos, more intention.

Let’s build better days, together.

                </p>
            </div>
            <div>
                <h1 className=' pt-15 text-center !text-blue-600'>Founders</h1>

            </div>
                </section>
			// {/* </div> */}
  );
};


