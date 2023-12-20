import { Text, Stack, HStack, Image } from "@chakra-ui/react"

export const Home = () => {

    return (

        <Stack>
            <Image
                pos="absolute"
                top={0}
                right={0}
                src='/bg.png'
                height="100vh"
                flex-shrink='0'
                filter='blur(1px)'
            />

            <Stack pos="absolute">
                <Stack>
                    <Text fontSize='24'>
                        <Text as='b'>Kita Onsen</Text>, the traditional Onsen in the Nasu
                    </Text>
                    <Text fontSize='14'>Found deep in the mountains of Tochigi Prefecture's Nasu Highlands, Kita Onsen Ryokan is the oldest and simplest.</Text>
                </Stack>

                <Stack
                    border-radius='20px'
                    background='rgba(255, 255, 255, 0.20)'
                    box-shadow='0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                    backdrop-filter='blur(15px)'>
                    <Text fontSize='64'>-3°C</Text>
                    <Text>Today. Dec 18</Text>
                    <HStack>
                        <Text>Monday</Text>
                        <Text>Check the weather →</Text>
                    </HStack>
                </Stack>

                <HStack>

                    <Stack>
                        <Image
                            border-radius='20px'
                            background='url(<path-to-image>), lightgray 50% / cover no-repeat'
                        />
                        <Stack>
                            <Text>Get inspired to visit Onsen</Text>
                            <Text>of Nasu</Text>
                        </Stack>
                    </Stack>

                    <Stack>
                        <Text>Way to get</Text>
                        <Text>to Kita Onsen</Text>
                        <HStack>
                            <Text>From</Text>
                            <Stack>
                                <Text>JP TYO</Text>
                                <Text>Tokyo</Text>
                            </Stack>
                        </HStack>
                        <Text>02h 47m・4 stops</Text>
                        <HStack>
                            <Text>To</Text>
                            <Stack>
                                <Text>JP TGI</Text>
                                <Text>Tochigi</Text>
                            </Stack>
                        </HStack>
                        <Text>Check the route →</Text>
                    </Stack>

                </HStack>

                <Stack>
                    <Text>Next</Text>
                    <Text>Tsutsuji Suspension Bridge</Text>
                </Stack>

            </Stack>

        </Stack>

    )
}

