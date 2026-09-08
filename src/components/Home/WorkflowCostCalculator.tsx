import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    Heading,
    Input,
    Link as ChakraLink,
    SimpleGrid,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

import { captureEvent, captureLeadIntent } from '../../lib/analytics';

const WEEKS_PER_MONTH = 4.33;
const PILOT_PRICE = 5000;

interface WorkflowInputs {
    people: number;
    weeklyHours: number;
    hourlyCost: number;
    timeReturnedPercent: number;
}

export interface WorkflowEconomics {
    monthlyLabourCost: number;
    monthlyCapacityReturned: number;
    pilotPaybackMonths: number;
}

export function calculateWorkflowEconomics({
    people,
    weeklyHours,
    hourlyCost,
    timeReturnedPercent,
}: WorkflowInputs): WorkflowEconomics | null {
    const values = [people, weeklyHours, hourlyCost, timeReturnedPercent];
    if (
        values.some((value) => !Number.isFinite(value) || value <= 0) ||
        people > 100 ||
        weeklyHours > 80 ||
        hourlyCost > 1000 ||
        timeReturnedPercent > 100
    ) {
        return null;
    }

    const monthlyLabourCost =
        people * weeklyHours * hourlyCost * WEEKS_PER_MONTH;
    const monthlyCapacityReturned =
        monthlyLabourCost * (timeReturnedPercent / 100);

    return {
        monthlyLabourCost,
        monthlyCapacityReturned,
        pilotPaybackMonths: PILOT_PRICE / monthlyCapacityReturned,
    };
}

const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

interface WorkflowCostCalculatorProps {
    showMethodLink?: boolean;
}

function WorkflowCostCalculator({
    showMethodLink = true,
}: WorkflowCostCalculatorProps) {
    const [people, setPeople] = useState('');
    const [weeklyHours, setWeeklyHours] = useState('');
    const [hourlyCost, setHourlyCost] = useState('');
    const [timeReturnedPercent, setTimeReturnedPercent] = useState('');
    const hasTrackedCalculation = useRef(false);

    const muted = useColorModeValue('ink.600', 'paper.300');
    const surface = useColorModeValue('paper.100', 'ink.900');
    const fieldBg = useColorModeValue('paper.50', 'ink.950');
    const border = useColorModeValue('paper.300', 'ink.700');

    const result = useMemo(
        () =>
            calculateWorkflowEconomics({
                people: Number(people),
                weeklyHours: Number(weeklyHours),
                hourlyCost: Number(hourlyCost),
                timeReturnedPercent: Number(timeReturnedPercent),
            }),
        [hourlyCost, people, timeReturnedPercent, weeklyHours]
    );
    const inputValues = [people, weeklyHours, hourlyCost, timeReturnedPercent];
    const hasAnyInput = inputValues.some((value) => value.trim() !== '');
    const hasAllInputs = inputValues.every((value) => value.trim() !== '');

    useEffect(() => {
        if (!result || hasTrackedCalculation.current) return;
        hasTrackedCalculation.current = true;
        captureEvent('workflow_cost_calculated');
    }, [result]);

    const fieldStyles = {
        bg: fieldBg,
        borderColor: border,
        borderRadius: '6px',
        _hover: { borderColor: 'moss.500' },
        _focusVisible: {
            borderColor: 'moss.600',
            boxShadow: '0 0 0 1px var(--chakra-colors-moss-600)',
        },
    };

    return (
        <Box
            as="section"
            id="calculator"
            py={{ base: 16, md: 24 }}
            borderTop="1px solid"
            borderColor={border}
        >
            <Heading
                as="h2"
                fontSize={{ base: '42px', md: '58px' }}
                fontWeight="500"
            >
                A quick cost check
            </Heading>
            <Text mt={5} maxW="620px" color={muted} lineHeight="1.75">
                If a job repeats every week, four rough numbers can tell you
                whether software is worth a closer look
            </Text>
            {showMethodLink ? (
                <ChakraLink
                    as={Link}
                    href="/workflow-automation-roi-calculator"
                    display="inline-block"
                    mt={4}
                    color="moss.700"
                    fontWeight="700"
                >
                    How the estimate works
                </ChakraLink>
            ) : null}

            <Grid
                mt={{ base: 10, md: 14 }}
                templateColumns={{ base: '1fr', lg: '1.05fr 0.95fr' }}
                gap={{ base: 10, lg: 16 }}
                alignItems="start"
            >
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
                    <FormControl>
                        <FormLabel htmlFor="workflow-people">
                            People doing the work
                        </FormLabel>
                        <Input
                            id="workflow-people"
                            type="number"
                            inputMode="numeric"
                            min="1"
                            max="100"
                            step="1"
                            placeholder="2"
                            value={people}
                            onChange={(event) => setPeople(event.target.value)}
                            {...fieldStyles}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="workflow-hours">
                            Hours each person spends weekly
                        </FormLabel>
                        <Input
                            id="workflow-hours"
                            type="number"
                            inputMode="decimal"
                            min="0.5"
                            max="80"
                            step="0.5"
                            placeholder="6"
                            value={weeklyHours}
                            onChange={(event) =>
                                setWeeklyHours(event.target.value)
                            }
                            {...fieldStyles}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="workflow-cost">
                            Loaded hourly cost (USD)
                        </FormLabel>
                        <Input
                            id="workflow-cost"
                            type="number"
                            inputMode="decimal"
                            min="1"
                            max="1000"
                            step="1"
                            placeholder="75"
                            value={hourlyCost}
                            onChange={(event) =>
                                setHourlyCost(event.target.value)
                            }
                            {...fieldStyles}
                        />
                        <FormHelperText color={muted}>
                            Include salary, benefits and overhead
                        </FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="workflow-return">
                            Time the tool could give back (%)
                        </FormLabel>
                        <Input
                            id="workflow-return"
                            type="number"
                            inputMode="decimal"
                            min="1"
                            max="100"
                            step="5"
                            placeholder="40%"
                            value={timeReturnedPercent}
                            onChange={(event) =>
                                setTimeReturnedPercent(event.target.value)
                            }
                            {...fieldStyles}
                        />
                        <FormHelperText color={muted}>
                            Pick a number you would show your own team
                        </FormHelperText>
                    </FormControl>
                </SimpleGrid>

                <Box
                    bg={surface}
                    border="1px solid"
                    borderColor={border}
                    borderRadius="4px 24px 24px 24px"
                    p={{ base: 6, md: 8 }}
                    aria-live="polite"
                >
                    {result ? (
                        <>
                            <Grid gap={7}>
                                <Box>
                                    <Text color={muted} fontSize="sm">
                                        Estimated monthly labour cost
                                    </Text>
                                    <Text
                                        mt={1}
                                        fontFamily="heading"
                                        fontSize={{ base: '4xl', md: '5xl' }}
                                        lineHeight="1"
                                    >
                                        {money.format(result.monthlyLabourCost)}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text color={muted} fontSize="sm">
                                        Estimated monthly value of time saved
                                    </Text>
                                    <Text
                                        mt={1}
                                        fontSize="2xl"
                                        fontWeight="700"
                                    >
                                        {money.format(
                                            result.monthlyCapacityReturned
                                        )}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text color={muted} fontSize="sm">
                                        Time savings worth $5,000
                                    </Text>
                                    <Text
                                        mt={1}
                                        fontSize="2xl"
                                        fontWeight="700"
                                    >
                                        {result.pilotPaybackMonths.toFixed(1)}{' '}
                                        months
                                    </Text>
                                </Box>
                            </Grid>
                            <Text mt={8} color={muted} lineHeight="1.7">
                                This values time saved at your hourly cost.
                                Software costs and ongoing fees are excluded.
                                Your payroll costs may stay the same.
                            </Text>
                            <Button
                                as={Link}
                                href="#contact"
                                mt={7}
                                rightIcon={<FaArrowRight size="12px" />}
                                bg="ink.900"
                                color="paper.50"
                                onClick={() => captureLeadIntent('calculator')}
                                _hover={{
                                    bg: 'moss.700',
                                    transform: 'translateY(-2px)',
                                    textDecoration: 'none',
                                }}
                                _active={{ transform: 'translateY(0)' }}
                            >
                                Start a project
                            </Button>
                        </>
                    ) : hasAnyInput ? (
                        <Box minH={{ base: '180px', md: '250px' }}>
                            <Text fontFamily="heading" fontSize="3xl">
                                {hasAllInputs
                                    ? 'Those numbers look off'
                                    : 'Fill in the four boxes'}
                            </Text>
                            <Text mt={5} color={muted} lineHeight="1.75">
                                {hasAllInputs
                                    ? 'Try 1-100 people, 0.5-80 weekly hours, $1-$1,000 per hour and 1%-100% time returned'
                                    : 'The estimate shows up once every field has something in it'}
                            </Text>
                        </Box>
                    ) : (
                        <Box minH={{ base: '180px', md: '250px' }}>
                            <Text fontFamily="heading" fontSize="3xl">
                                Add four rough numbers
                            </Text>
                            <Text mt={5} color={muted} lineHeight="1.75">
                                Use loaded cost and pick a time saving that
                                feels believable.
                            </Text>
                        </Box>
                    )}
                </Box>
            </Grid>
        </Box>
    );
}

export default WorkflowCostCalculator;
